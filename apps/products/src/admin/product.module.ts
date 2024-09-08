import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CommonProductModule } from '@app/products/modules/common.product.module';

@Module({
  imports: [CommonProductModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
