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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  update(@Param() { id }: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(id, soft);
  }

  @Public()
  @Patch('recover')
  recover(@Body() loginDto: LoginDto) {
    return this.usersService.recover(loginDto);
  }
}
