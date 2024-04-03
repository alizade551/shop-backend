import { OmitType } from '@nestjs/swagger';
import { User } from 'src/domain/users/entities/user.entity';

export class ProfileSchema extends OmitType(User, ['orders'] as const) {}
