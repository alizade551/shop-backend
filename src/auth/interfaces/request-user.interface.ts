import { Role } from '../roles/enums/role.enum';

export interface RequestUser {
  readonly id: number;
  readonly role: Role;
}
