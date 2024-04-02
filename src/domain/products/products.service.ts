import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PAGE_SIZE } from 'src/common/util/common.constants';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IdFilenameDto } from 'src/files/dto/id-filename.dto';

@Injectable()
export class ProductsService {
  deleteImage(id: any, filename: any) {
    throw new Error('Method not implemented.');
  }
  downloadImage(id: any, filename: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  uploadImages(id: number, files: any) {
    throw new Error('Method not implemented.');
  }

  async exists(name: string) {
    const product = await this.productRepository.findOne({
      where: [
        {
          name,
        },
      ],
    });

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const exist = await this.exists(createProductDto.name);
    if (exist) {
      throw new BadRequestException('Email or phone already exists');
    }

    const product = this.productRepository.create(createProductDto);

    return await this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return await this.productRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: { categories: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, udateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...udateProductDto,
    });
    if (!product) throw new NotFoundException('User not found');

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('User not found');

    return this.productRepository.remove(product);
  }
}
