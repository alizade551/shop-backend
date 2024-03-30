import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles/enums/role.enum';
import { NonEmptyArray } from 'src/common/util/array.util';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: NonEmptyArray<Role>) =>
  SetMetadata(ROLES_KEY, roles);
