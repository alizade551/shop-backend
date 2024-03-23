import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'shopnest',
  entities: ['dist/domain/**/*.entity.js'],
  migrations: ['dist/databse/migrations/*.js'],
});
