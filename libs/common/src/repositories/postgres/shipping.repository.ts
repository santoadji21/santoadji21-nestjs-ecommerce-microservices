import { PrismaPostgresService } from "@app/common/database/postgres";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ShippingRepository {
	constructor(private prismaService: PrismaPostgresService) {}

	get table() {
		return this.prismaService.shipping;
	}

	async findById(id: string) {
		return await this.table.findFirst({
			where: {
				id: id,
			},
			include: {
				order: {
					include: {
						payment: true,
						user: true,
					},
				},
			},
		});
	}

	async update(id: string, data: Prisma.shippingUpdateInput) {
		return await this.table.update({
			data: data,
			where: {
				id: id,
			},
		});
	}
}
