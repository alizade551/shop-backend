import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.services';
import { AuthModule } from 'src/auth/auth.module';
import { UsersSubscriber } from './subscribers/users.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber],
})
export class UsersModule {}
