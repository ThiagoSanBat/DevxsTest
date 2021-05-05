import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { checkIsAdmin, Roles } from '../permissions/permissions.decorator';
import { Role } from '../permissions/permissions.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  //@Roles(Role.Admin)
  create(@Req() request: Request, @Body() createProductDto: CreateProductDto) {
    const user = request.user;
    checkIsAdmin(user);
    this.logger.log(
      `criando ${createProductDto.name} para o userId:${user.id}`,
    );
    return this.productsService.create({
      description: createProductDto.description,
      name: createProductDto.name,
      price: createProductDto.price,
      createdBy: { connect: { email: user.email } },
      publishedAt: new Date(),
    });
  }

  @Get()
  findAll(@Req() request: Request) {
    const user = request.user;
    return user.role === Role.Guest
      ? this.productsService.findAll()
      : this.productsService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    const user = request.user;
    return this.productsService.findOne(+id, user.id);
  }

  @Patch(':id')
  //@Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ) {
    const user = request.user;
    checkIsAdmin(user);
    return this.productsService.update(+id, updateProductDto, user.id);
  }

  @Delete(':id')
  //@Roles(Role.Admin)
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = request.user;
    checkIsAdmin(user);
    return this.productsService.remove(+id, user.id);
  }
}
