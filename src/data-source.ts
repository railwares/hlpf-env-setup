import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
 
dotenv.config();
 
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST as string,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB as string,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
