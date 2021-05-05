import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { UniqueKeysService } from '../unique-keys/unique-keys.service';
import { ParameterService } from '../parameter/parameter.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    EmailService,
    UniqueKeysService,
    ParameterService,
    ConfigService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
