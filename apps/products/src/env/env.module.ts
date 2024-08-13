import { ProductEnvService } from "@app/products/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [ProductEnvService],
	exports: [ProductEnvService],
})
export class ProductEnvModule {}
