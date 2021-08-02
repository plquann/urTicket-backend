import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, UserRole } from 'src/constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);