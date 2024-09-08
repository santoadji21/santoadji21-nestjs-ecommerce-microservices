import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { StockEnvService } from "apps/stock/src/env/env.service";

@Module({
	imports: [ConfigModule],
	providers: [StockEnvService],
	exports: [StockEnvService],
})
export class StockEnvModule {}
