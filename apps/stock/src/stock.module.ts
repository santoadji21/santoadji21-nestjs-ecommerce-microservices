import { Module } from "@nestjs/common";
import { CommonStockModule } from "apps/stock/src/modules/common.stock.module";
import { StockController } from "apps/stock/src/stock.controller";
import { StockService } from "apps/stock/src/stock.service";

@Module({
	imports: [CommonStockModule],
	controllers: [StockController],
	providers: [StockService],
})
export class StockModule {}
