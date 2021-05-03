import { Module } from '@nestjs/common';
import { UniqueKeysService } from './unique-keys.service';
import { UniqueKeysController } from './unique-keys.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UniqueKeysController],
  providers: [UniqueKeysService, PrismaService],
})
export class UniqueKeysModule {}
