import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interfaces/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async validateLocal(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const isMatch = await this.hashingService.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const requestUser: RequestUser = { id: user.id };
    return requestUser;
  }
}
