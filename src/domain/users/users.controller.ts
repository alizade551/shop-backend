import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdDto } from 'src/common/dto/id.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UsersService } from './users.services';
import { RemoveDto } from 'src/common/dto/remove.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequestUser } from 'src/auth/interfaces/request-user.interface';
import { User as CurrentUser } from 'src/auth/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User | BadRequestException> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdDto,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  remove(
    @Param() { id }: IdDto,
    @Query() { soft }: RemoveDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.remove(id, soft, user);
  }

  @Public()
  @Patch('recover')
  recover(@Body() loginDto: LoginDto, @CurrentUser() user: RequestUser) {
    return this.usersService.recover(loginDto, user);
  }
}
