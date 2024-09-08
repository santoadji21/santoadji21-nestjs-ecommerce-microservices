import { PrismaPostgresService } from "@app/common/database/postgres";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrderRepository {
	constructor(private prismaService: PrismaPostgresService) {}

	get table() {
		return this.prismaService.order;
	}

	async create(data: Prisma.orderCreateInput) {
		return await this.table.create({ data });
	}

	async findById(order_id: string) {
		return await this.table.findFirst({
			where: {
				id: order_id,
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
						name: true,
						phone: true,
					},
				},
				payment: true,
				shipping: true,
				order_item: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	async findManyByUserId(user_id: string) {
		return await this.table.findMany({
			where: {
				user_id: user_id,
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
						name: true,
						phone: true,
					},
				},
				payment: true,
				shipping: true,
				order_item: {
					include: {
						product: true,
					},
				},
			},
		});
	}
}
