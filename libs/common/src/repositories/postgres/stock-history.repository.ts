import { PrismaPostgresService } from "@app/common/database/postgres";
import { Injectable } from "@nestjs/common";
import { Prisma, STOCK_HISTORY_TYPE } from "@prisma/client";

@Injectable()
export class StockHistoryRepository {
	constructor(private prismaService: PrismaPostgresService) {}

	get table() {
		return this.prismaService.stock_history;
	}

	async create(data: Prisma.stock_historyCreateInput) {
		const createHistory = await this.table.create({
			data,
		});

		if (createHistory) {
			const stock = await this.prismaService.stock.findFirst({
				where: {
					id: data.stock_id,
				},
			});
			if (!stock) {
				throw new Error("Stock not found");
			}
			if (!data.amount) {
				throw new Error("Amount not found");
			}
			if (data.history_type === STOCK_HISTORY_TYPE.INPUT) {
				await this.prismaService.stock.update({
					data: {
						stock: stock.stock + data.amount,
					},
					where: {
						id: stock.id,
					},
				});
			} else if (data.history_type === STOCK_HISTORY_TYPE.OUT_SALES) {
				await this.prismaService.stock.update({
					data: {
						stock: stock.stock - data.amount,
					},
					where: {
						id: stock.id,
					},
				});
			} else if (data.history_type === STOCK_HISTORY_TYPE.REJECT) {
				await this.prismaService.stock.update({
					data: {
						stock: stock.stock - data.amount,
					},
					where: {
						id: stock.id,
					},
				});
			}
		}
		return createHistory;
	}
}
