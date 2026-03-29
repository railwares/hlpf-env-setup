import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
 
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

import { CreateTables1700000001000 } from './migrations/1700000001000-CreateTables';
import { AddIsActiveToProducts1774820052104 } from './migrations/1774820052104-AddIsActiveToProducts';

import { AppController } from './app.controller';
import { AppService } from './app.service';



 
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
  entities: [Category, Product],      
  synchronize: false,	// ВИМКНЕНО! Тільки міграції
  migrationsRun: true,   // автоматично запускати міграції при старті
  migrations: [CreateTables1700000001000, AddIsActiveToProducts1774820052104],    
}),

CacheModule.registerAsync({
  	isGlobal: true,
  	useFactory: async () => ({
    	store: await redisStore({
      	socket: {
        	host: process.env.REDIS_HOST,
        	port: parseInt(process.env.REDIS_PORT || '6379', 10),
      	},
    	}),
    	ttl: 60 * 1000, // 60 секунд у мілісекундах
  	}),
	}),
	CategoriesModule,
	ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

