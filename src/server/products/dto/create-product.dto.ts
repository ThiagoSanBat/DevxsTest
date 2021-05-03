import { Decimal } from '@prisma/client/runtime';

export class CreateProductDto {
  name: string;
  description: string;
  price: Decimal | number | string;
  publishedAt: Date | string;
  images?: { id: number }[];
  public toString = (): string => {
    return `Product[name:${this.name}, description: ${this.description}, price: ${this.price}]`;
  };
}
