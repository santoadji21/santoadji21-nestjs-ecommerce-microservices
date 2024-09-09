import { ShippingEnvService } from "@app/shipping/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [ShippingEnvService],
	exports: [ShippingEnvService],
})
export class ShippingEnvModule {}
