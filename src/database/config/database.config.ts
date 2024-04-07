import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductsSubscriber } from 'src/domain/products/subscribers/products.subscriber';

export default registerAs('database', () => {
  const config = {
    type: 'postgres',
    autoLoadEntities: true,
    url: process.env.DATABASE_URL,
    synchronize: true,
  } as const satisfies TypeOrmModuleOptions;

  return config;
});
