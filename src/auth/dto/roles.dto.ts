import { IsEnum } from 'class-validator';
import { Role } from '../roles/enums/role.enum';

export class RolesDto {
  @IsEnum(Role)
  readonly role: Role;
}
