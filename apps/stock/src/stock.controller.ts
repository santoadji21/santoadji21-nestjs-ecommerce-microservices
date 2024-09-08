import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { RoleGuard } from "@app/common/auth/role-auth.guard";
import { EVENTS } from "@app/common/constants/events/events";
import { Roles } from "@app/common/decorators";
import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { USER_LEVEL } from "@prisma/client";
import { AddStockDto } from "apps/stock/src/dto/stock.dto";
import { StockService } from "apps/stock/src/stock.service";
import { PinoLogger } from "nestjs-pino";

@Controller()
export class StockController {
	constructor(
		private readonly stockService: StockService,
		private readonly logger: PinoLogger,
	) {}

	@Get("get-stock")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async getStock(@Request() req) {
		this.logger.info("Get stock");
		this.logger.info(`Email: ${req}`);
		return {
			data: {
				stock: "Hello World!",
			},
			message: "get stock success",
		};
	}

	@Post("add-stock")
	async addStock(@Body() data: AddStockDto, @Request() req) {
		data.user_id = req.user.id;
		const createStock = await this.stockService.addStock(data);

		return {
			data: createStock,
			message: "create stock success",
		};
	}

	@Delete("remove-stock")
	async removeStock(@Body() data: AddStockDto, @Request() req) {
		data.user_id = req.user.id;
		const createStock = await this.stockService.removeStock(data);

		return {
			data: createStock,
			message: "remove stock success",
		};
	}

	@EventPattern(EVENTS.STOCK.SALES_STOCK)
	async salesStock(data: { order_id: string }) {
		this.logger.warn("Sales stock :", data);
		await this.stockService.removeStockSales(data.order_id);
	}

	@EventPattern(EVENTS.STOCK.RETURN_SALES_STOCK)
	async returnStockSales(data: { order_id: string }) {
		this.logger.warn("Return Sales stock :", data);
		await this.stockService.returnStockSales(data.order_id);
	}
}
