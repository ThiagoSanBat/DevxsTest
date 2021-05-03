import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService){}

  async create(data: Prisma.ImageCreateInput) {
    return await this.prismaService.image.create({data});
  }

  async findAll() {
    return await this.prismaService.image.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.image.findUnique({where: {id}})
  }

  async update(id: number, updateImageDto: Prisma.ImageUpdateInput) {
    return await this.prismaService.image.update({
      where:{id}, data: {
        fileName: updateImageDto.fileName,
        filePath: updateImageDto.filePath
      }
    })
  }

  async remove(id: number) {
    return await this.prismaService.image.delete({where:{id}});
  }
}
