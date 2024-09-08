import { ProductModule } from "@app/products/admin/product.module";
import { CommonProductModule } from "@app/products/modules/common.product.module";
import { ProductsController } from "@app/products/products.controller";
import { ProductsService } from "@app/products/products.service";
import { Module } from "@nestjs/common";

@Module({
	imports: [ProductModule, CommonProductModule],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
