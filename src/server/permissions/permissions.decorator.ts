import { HttpException, HttpStatus, SetMetadata } from '@nestjs/common';
import { User } from 'prisma/prisma-client';
import { Role } from './permissions.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export function checkIsAdmin(user: User) {
  if (user.role !== Role.Admin) {
    throw new HttpException('Resource not allowed', HttpStatus.UNAUTHORIZED);
  }
}
