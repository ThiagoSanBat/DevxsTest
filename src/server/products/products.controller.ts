import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Principal } from '../auth/user.decorator';
import { LoggedUser } from '../auth/dto/logged-user.dto';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Principal() user: LoggedUser,
    @Body() createProductDto: CreateProductDto,
  ) {
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
  findAll(@Principal() user: LoggedUser) {
    return this.productsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Principal() user: LoggedUser) {
    return this.productsService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Principal() user: LoggedUser,
  ) {
    return this.productsService.update(+id, updateProductDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Principal() user: LoggedUser) {
    return this.productsService.remove(+id, user.id);
  }
}
