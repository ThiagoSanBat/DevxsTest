import { prisma, Prisma } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return await this.prismaService.product.create({ data });
  }

  async findAll(userId: number) {
    return await this.prismaService.product.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const product = await this.prismaService.product.findMany({
      where: { id, userId },
    });
    if (product.length >= 0) {
      return product[0];
    }
    throw new HttpException('Resource not allowed', HttpStatus.UNAUTHORIZED);
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    const product = await this.findOne(id, userId);
    return await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        description: updateProductDto.description,
        name: updateProductDto.name,
        price: updateProductDto.price,
      },
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.findOne(id, userId);
    return await this.prismaService.product.delete({
      where: { id: product.id },
    });
  }
}
