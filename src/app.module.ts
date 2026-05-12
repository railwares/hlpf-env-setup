import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Додайте ConfigService
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
 
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

import { CreateTables1700000001000 } from './migrations/1700000001000-CreateTables';
import { AddIsActiveToProducts1774820052104 } from './migrations/1774820052104-AddIsActiveToProducts';
import { CreateUsers1776708532574 } from './migrations/1776708532574-CreateUsers'
import { CreateOrders1778615657570 } from './migrations/1778615657570-CreateOrders'
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'
import { Order } from './orders/entities/order.entity'
import { OrderItem } from './orders/entities/order-item.entity'
import { OrdersModule } from './orders/orders.module';
 
@Module({
  imports: [
	ConfigModule.forRoot({ isGlobal: true }),
	TypeOrmModule.forRoot({
  	type: 'postgres',
  host: process.env.POSTGRES_HOST as string,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB as string,
  entities: [Category, Product, User, Order, OrderItem],      
  synchronize: false,	// ВИМКНЕНО! Тільки міграції
  migrationsRun: true,   // автоматично запускати міграції при старті
  migrations: [CreateTables1700000001000, AddIsActiveToProducts1774820052104, CreateUsers1776708532574, CreateOrders1778615657570],    
}),

CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => {
    // Створюємо стор явно
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
      ttl: 60000,
    });

    return {
      store: store as any, // Приведення до any допомагає NestJS "прийняти" об'єкт
      ttl: 60000,
    };
  },
}),
	CategoriesModule,
	ProductsModule,
	UsersModule,
	AuthModule,
  OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

