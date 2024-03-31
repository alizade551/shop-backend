import {
  BadRequestException,
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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/common/util/common.constants';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RequestUser } from 'src/auth/interfaces/request-user.interface';
import { Role } from 'src/auth/roles/enums/role.enum';
import { compareUserId } from 'src/auth/util/authorization.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
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
