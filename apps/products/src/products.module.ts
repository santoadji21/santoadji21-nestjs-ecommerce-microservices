import { AUTH_SERVICE } from "@app/common/constants/services/services";
import { ProductEnvModule } from "@app/products/env/env.module";
import { ProductEnvService } from "@app/products/env/env.service";
import { ProductsController } from "@app/products/products.controller";
import { ProductsService } from "@app/products/products.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ClientsModule.registerAsync([
			{
				imports: [ProductEnvModule],
				inject: [ProductEnvService],
				name: AUTH_SERVICE,
				useFactory: (productEnv: ProductEnvService) => ({
					transport: Transport.TCP,
					options: {
						host: productEnv.get("AUTH_HOST"),
						port: productEnv.get("AUTH_PORT"),
					},
				}),
			},
		]),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
