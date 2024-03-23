import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/common/util/common.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async existsUser(email: string, phone: string) {
    const user = await this.userRepository.findOne({
      where: [
        {
          email,
        },
        {
          phone,
        },
      ],
    });

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const exist = await this.existsUser(
      createUserDto.email,
      createUserDto.phone,
    );
    if (exist) {
      throw new BadRequestException('Email or phone already exists');
    }

    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return await this.userRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) throw new NotFoundException('User not found');

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.remove(user);
  }
}
