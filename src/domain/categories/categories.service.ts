import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/querying/dto/pagination.dto';
import { DefaultPageSize } from 'src/querying/util/querying.constants';
import { PaginationService } from 'src/querying/pagination.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly paginationService: PaginationService,
  ) {}

  async exist(name: string) {
    const category = await this.categoryRepository.findOne({
      where: [
        {
          name: name,
        },
      ],
    });

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const exist = await this.exist(createCategoryDto.name);

    if (exist) {
      throw new BadRequestException('Category already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.CATEGORY;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.categoryRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        products: true,
      },
    });
    if (!category) throw new NotFoundException('User not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) throw new NotFoundException('User not found');

    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length) {
      throw new ConflictException('Category has related to products');
    }
    return this.categoryRepository.remove(category);
  }
}
