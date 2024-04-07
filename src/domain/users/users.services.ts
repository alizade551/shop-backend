import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/querying/dto/pagination.dto';
import { DefaultPageSize } from 'src/querying/util/querying.constants';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RequestUser } from 'src/auth/interfaces/request-user.interface';
import { Role } from 'src/auth/roles/enums/role.enum';
import { compareUserId } from 'src/auth/util/authorization.util';
import { PaginationService } from 'src/querying/pagination.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;

    const limit = paginationDto.limit ?? DefaultPageSize.USER;
    const offset = this.paginationService.calculateOffset(limit, page);

    const [data, count] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, count);

    return { data, meta };
  }

  async findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: RequestUser,
  ) {
    if (currentUser.role !== Role.ADMIN) {
      compareUserId(currentUser.id, id);
    }
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number, soft: boolean, currentUser: RequestUser) {
    if (currentUser.role !== Role.ADMIN) {
      compareUserId(currentUser.id, id);

      if (!soft) {
        throw new ForbiddenException('Foribbden resurce');
      }
    }
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { orders: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return soft
      ? this.userRepository.softRemove(user)
      : this.userRepository.remove(user);
  }
  async recover(loginDto: LoginDto, currentUser: RequestUser) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      withDeleted: true,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (currentUser.role !== Role.ADMIN) {
      compareUserId(currentUser.id, user.id);
    }

    const isMatch = await this.hashingService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isDeleted) {
      throw new ConflictException('User not deleted');
    }

    return this.userRepository.recover(user);
  }
}
