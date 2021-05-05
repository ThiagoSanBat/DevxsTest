import { Injectable } from '@nestjs/common';

import { deCrypt, encrypt } from '../auth/crypt-util';
import { UserNotFoundException } from '../exceptions';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from 'prisma/prisma-client';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    data: Prisma.UserCreateInput,
    emailService: EmailService,
  ): Promise<User> {
    const cryptPassword = await encrypt(data.password);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: cryptPassword,
        role: data.role || 'GUEST',
        uniqueKeys: { create: {} },
      },
      include: {
        uniqueKeys: true,
      },
    });

    emailService.sendVerifyEmail(
      user,
      (await this.uniqueKeyActive(user.id)).uniqueKeys[0],
    );

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findVerifiedBy(email: string, password: string) {
    return await this.prisma.user.findFirst({
      where: { email, password, verified: true },
    });
  }

  async findByEmailAndPassword(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    const cryptPassword = await deCrypt(password, user.password);
    if (cryptPassword) {
      return user;
    }
    throw new UserNotFoundException('User/Password not found!');
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
      },
    });
  }

  async updateWithUniqueKey(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        verified: updateUserDto.verified,
        uniqueKeys: updateUserDto.uniqueKeys,
      },
    });
  }

  async remove(id: number) {
    const unique = await this.prisma.uniqueKey.findFirst({
      where: { userId: id },
    });
    await this.prisma.uniqueKey.delete({
      where: { id: unique.id },
    });
    await this.prisma.product.deleteMany({
      where: { userId: id },
    });
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async uniqueKeyActive(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        uniqueKeys: {
          where: {
            validatedAt: null,
          },
        },
      },
    });
  }
}
