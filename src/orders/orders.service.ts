import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateOrderDto, userId: number): Promise<Order> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        // Шукаємо продукт через manager транзакції
        const product = await qr.manager.findOne(Product, { where: { id: item.productId } });

        if (!product) {
          throw new NotFoundException(`Product #${item.productId} not found`);
        }

        // Перевіряємо наявність на складі
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for "${product.name}": available ${product.stock}, requested ${item.quantity}`);
        }

        // Зменшуємо stock і зберігаємо
        product.stock -= item.quantity;
        await qr.manager.save(product);

        // Створюємо позицію замовлення
        const orderItem = qr.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: product.price,
        });
        orderItems.push(orderItem);

        totalPrice += Number(product.price) * item.quantity;
      }

      // Створюємо і зберігаємо саме замовлення
      const order = qr.manager.create(Order, {
        user: { id: userId } as any,
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const saved = await qr.manager.save(order);

      // Якщо все пройшло без помилок — комітимо транзакцію
      await qr.commitTransaction();

      // Очищуємо кеш продуктів, оскільки їхній stock змінився
      await this.clearProductsCache();

      return saved;
    } catch (error) {
      // У разі будь-якої помилки — відкочуємо всі зміни назад
      await qr.rollbackTransaction();
      throw error;
    } finally {
      // Завжди закриваємо з'єднання
      await qr.release();
    }
  }

  private async clearProductsCache() {
    try {
      const store = (this.cacheManager as any).store;
      const keys: string[] = await store.keys('products:*');
      if (keys.length > 0) {
        await Promise.all(keys.map((k) => this.cacheManager.del(k)));
      }
    } catch (error) {
      console.error('Помилка очищення кешу:', error.message);
    }
  }

  async findAll(query: OrderQueryDto, userId: number, userRole: Role) {
    const { page = 1, pageSize = 10, status } = query;
    const skip = (page - 1) * pageSize;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.user', 'user');

    // Ownership check: звичайний юзер бачить тільки свої замовлення
    if (userRole !== Role.ADMIN) {
      qb.andWhere('order.userId = :userId', { userId });
    }

    // Фільтрація за статусом, якщо він переданий
    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    qb.skip(skip).take(pageSize).orderBy('order.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number, userId: number, userRole: Role): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Ownership check: захист від IDOR-атаки
    if (userRole !== Role.ADMIN && order.user.id !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const current = order.status;
    const next = dto.status;

    // Словник дозволених переходів
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [], // Фінальний статус
      [OrderStatus.CANCELLED]: [], // Фінальний статус
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(`Cannot change status from ${current} to ${next}`);
    }

    order.status = next;

    // Бонус: повернення товару на склад при скасуванні
    if (next === OrderStatus.CANCELLED) {
      for (const item of order.items) {
        item.product.stock += item.quantity;
        await this.productRepo.save(item.product);
      }
      await this.clearProductsCache(); // Інвалідуємо кеш продуктів
    }

    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    await this.orderRepo.remove(order);
  }
  // Методи findAll, findOne, updateStatus та remove додамо на наступному кроці!
}