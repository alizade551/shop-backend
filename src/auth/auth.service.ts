import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from './roles/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
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

    const requestUser: RequestUser = this.createRequestUser(user);
    return requestUser;
  }

  async validateJwt(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) throw new UnauthorizedException('Invalid token');
    const requestUser: RequestUser = this.createRequestUser(user);
    return requestUser;
  }

  login(user: RequestUser) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async assignRole(id: number, role: Role) {
    const user = await this.userRepository.preload({
      id,
      role,
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return await this.userRepository.save(user);
  }

  private createRequestUser(user: User) {
    const { id, role } = user;
    const requestUser: RequestUser = { id, role };
    return requestUser;
  }
}
