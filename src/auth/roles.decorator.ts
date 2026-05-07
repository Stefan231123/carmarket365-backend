import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../user/enums/user-role.enum';
import { ROLES_KEY } from './roles.guard';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
