import { AUTH_SERVICE } from "@app/common/constants/services/services";
import { ResponseInterceptorsModule } from "@app/common/interceptors/response/response.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { ProductModule } from "@app/products/admin/product.module";
import { ProductEnvModule } from "@app/products/env/env.module";
import { ProductEnvService } from "@app/products/env/env.service";
import { CommonProductModule } from "@app/products/modules/common.product.module";
import { ProductsController } from "@app/products/products.controller";
import { ProductsService } from "@app/products/products.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		ProductModule,
		CommonProductModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
