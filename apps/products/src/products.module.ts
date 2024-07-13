import { ProductsController } from '@app/products/products.controller';
import { ProductsService } from '@app/products/products.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
