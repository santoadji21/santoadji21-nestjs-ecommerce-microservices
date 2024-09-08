import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import { Injectable } from "@nestjs/common";
import { Prisma, STOCK_HISTORY_TYPE } from "@prisma/client";
import { AddStockDto } from "apps/stock/src/dto/stock.dto";

@Injectable()
export class StockService {
	constructor(private readonly repos: PostgresRepositoriesService) {}

	getHello(): string {
		return "Hello World!";
	}

	async addStock(data: AddStockDto) {
		let stock = await this.repos.stockRepository.findByProduct(data.product_id);
		if (!stock) {
			const stockPayload: Prisma.stockCreateInput = {
				stock: 0,
				product: {
					connect: {
						id: data.product_id,
					},
				},
			};
			stock = await this.repos.stockRepository.create(stockPayload);
		}
		const stockHistory: Prisma.stock_historyCreateInput = {
			stock_id: stock.id,
			history_type: STOCK_HISTORY_TYPE.INPUT,
			notes: data.notes as string,
			amount: data.amount,
			created_by: {
				connect: {
					id: data.user_id,
				},
			},
		};
		const createStock =
			await this.repos.stockHistoryRepository.create(stockHistory);
		return createStock;
	}

	async removeStock(data: AddStockDto) {
		let stock = await this.repos.stockRepository.findByProduct(data.product_id);
		if (!stock) {
			const stockPayload: Prisma.stockCreateInput = {
				stock: 0,
				product: {
					connect: {
						id: data.product_id,
					},
				},
			};
			stock = await this.repos.stockRepository.create(stockPayload);
		}
		const stockHistory: Prisma.stock_historyCreateInput = {
			stock_id: stock.id,
			history_type: STOCK_HISTORY_TYPE.REJECT,
			notes: data.notes as string,
			amount: data.amount,
			created_by: {
				connect: {
					id: data.user_id,
				},
			},
		};
		const createStock =
			await this.repos.stockHistoryRepository.create(stockHistory);
		return createStock;
	}

	async removeStockSales(order_id: string) {
		const order = await this.repos.orderRepository.findById(order_id);
		if (!order) throw new Error("Order not found");
		const orderItems = order.order_item;

		for (const item of orderItems) {
			let stock = await this.repos.stockRepository.findByProduct(
				item.product_id,
			);
			if (!stock) {
				const stockPayload: Prisma.stockCreateInput = {
					stock: 0,
					product: {
						connect: {
							id: item.product_id,
						},
					},
				};
				stock = await this.repos.stockRepository.create(stockPayload);
			}

			const stockHistory: Prisma.stock_historyCreateInput = {
				stock_id: stock.id,
				history_type: STOCK_HISTORY_TYPE.OUT_SALES,
				external_id: order.id,
				notes: order.notes,
				amount: item.qty,
				created_by: {
					connect: {
						id: order.user_id,
					},
				},
			};

			await this.repos.stockHistoryRepository.create(stockHistory);
		}
	}

	async returnStockSales(order_id: string) {
		const order = await this.repos.orderRepository.findById(order_id);
		if (!order) throw new Error("Order not found");
		const orderItems = order.order_item;

		for (const item of orderItems) {
			let stock = await this.repos.stockRepository.findByProduct(
				item.product_id,
			);
			if (!stock) {
				const stockPayload: Prisma.stockCreateInput = {
					stock: 0,
					product: {
						connect: {
							id: item.product_id,
						},
					},
				};
				stock = await this.repos.stockRepository.create(stockPayload);
			}

			const stockHistory: Prisma.stock_historyCreateInput = {
				stock_id: stock.id,
				history_type: STOCK_HISTORY_TYPE.INPUT,
				external_id: order.id,
				notes: order.notes,
				amount: item.qty,
				created_by: {
					connect: {
						id: order.user_id,
					},
				},
			};

			await this.repos.stockHistoryRepository.create(stockHistory);
		}
	}
}
