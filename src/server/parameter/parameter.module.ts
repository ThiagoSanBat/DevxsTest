import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterController } from './parameter.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ParameterController],
  providers: [ParameterService, PrismaService],
})
export class ParameterModule {}
