import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FilesModule } from 'src/files/files.module';
import { ProductsSubscriber } from './subscribers/products.subscriber';
import { QueryingModule } from 'src/querying/querying.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilesModule, QueryingModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsSubscriber],
})
export class ProductsModule {}
