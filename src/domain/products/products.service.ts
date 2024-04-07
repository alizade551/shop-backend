import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPageSize } from 'src/querying/util/querying.constants';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/querying/dto/pagination.dto';

import {
  BASE_PATH,
  FilePath,
  MaxFileCount,
} from 'src/files/util/file.constants';
import { join } from 'path';
import { pathExists } from 'fs-extra';
import { StorageService } from 'src/files/storage/storage.service';
import { PaginationService } from 'src/querying/pagination.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly storageService: StorageService,
    private readonly paginationService: PaginationService,
  ) {}

  async uploadImages(id: number, files: Express.Multer.File[]) {
    await this.findOne(id);

    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES);

    if (await pathExists(join(BASE_PATH, path))) {
      const incomingFilecount = files.length;
      const dirFilecount = await this.storageService.getDirFilecount(path);
      const totalFilecount = incomingFilecount + dirFilecount;

      this.storageService.validateFilecount(
        totalFilecount,
        MaxFileCount.PRODUCT_IMAGES,
      );
    }
    await this.storageService.createDir(path);
    await Promise.all(
      files.map((file) => this.storageService.saveFile(path, file)),
    );
  }

  async downloadImage(id: number, filename: string) {
    await this.findOne(id);

    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES, filename);

    await this.storageService.validatePath(path);

    return this.storageService.getFile(path);
  }

  async deleteImage(id: number, filename: string) {
    await this.findOne(id);

    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES, filename);

    await this.storageService.validatePath(path);

    await this.storageService.delete(path);
  }

  private async deleteBaseDir(id: number) {
    const { BASE } = FilePath.Products;

    const path = join(BASE, id.toString());
    await this.storageService.delete(path);
  }

  async findOne(id: number) {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        categories: true,
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);

    return await this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.PRODUCT;
    const offset = this.paginationService.calculateOffset(limit, page);

    const [data, count] = await this.productRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
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
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    await this.deleteBaseDir(id);

    return product;
  }
}
