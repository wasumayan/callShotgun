import "dotenv/config"; // Make sure this is at the top of your entry file (e.g., src/server.ts)
import { DataSource } from 'typeorm';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Set to false in production
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
}); 