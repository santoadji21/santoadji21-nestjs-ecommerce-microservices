import { ProductsService } from '@app/products/products.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getHello(): string {
    return this.productsService.getHello();
  }
}
