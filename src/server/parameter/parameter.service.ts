import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ParameterService {

  constructor(private readonly prismaService: PrismaService){}

  async create(data: Prisma.ParameterCreateInput) {
    return await this.prismaService.parameter.create({
      data
    })
  }

  async findAll() {
    return await this.prismaService.parameter.findMany();
  }

  async findOne(key: string) {
    return await this.prismaService.parameter.findUnique({where: {key}})
  }

  async update(key: string, data: Prisma.ParameterUpdateInput) {
    return await this.prismaService.parameter.update({where: {key}, data})
  }

  async remove(key: string) {
    return await this.prismaService.parameter.delete({where: {key}})
  }
}
