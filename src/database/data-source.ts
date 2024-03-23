import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/domain/**/*.entity.js'],
  migrations: ['dist/databse/migrations/*.js'],
});
