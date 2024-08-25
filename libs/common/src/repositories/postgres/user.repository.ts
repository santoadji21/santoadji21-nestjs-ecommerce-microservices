import { PrismaPostgresService } from "@app/common/database/postgres";
import { Injectable } from "@nestjs/common";
import { Prisma, USER_LEVEL, user as User } from "@prisma/client";

@Injectable()
export class UserRepository {
	constructor(private prismaService: PrismaPostgresService) {}

	get table() {
		return this.prismaService.user;
	}

	async createUser(data: Prisma.userCreateInput) {
		return await this.table.create({
			data: data,
		});
	}

	async getAllUsers() {
		return await this.table.findMany();
	}

	async getUserByEmail(email: string) {
		return await this.table.findFirst({
			where: {
				email: email,
			},
		});
	}

	async getUserById(id: string) {
		return await this.table.findFirst({
			where: {
				id: id,
			},
		});
	}

	async getUserByUserLevel(level: USER_LEVEL) {
		return await this.table.findMany({
			where: {
				user_level: level,
			},
		});
	}

	async getUserByCustom(where: Prisma.userWhereInput) {
		return await this.table.findMany({
			where: where,
		});
	}

	//Update user
	async updateUser(id: string, data: Prisma.userUpdateInput) {
		return await this.table.update({
			where: {
				id: id,
			},
			data,
		});
	}

	// Delete user(s)
	async deleteUser(id: string | string[]) {
		if (Array.isArray(id)) {
			// Bulk delete
			const deleteResult = await this.table.deleteMany({
				where: {
					id: {
						in: id,
					},
				},
			});
			return deleteResult.count; // Return the number of deleted records
		}
		// Single delete
		await this.table.delete({
			where: {
				id: id,
			},
		});
		return 1; // Return 1 because only one record is deleted
	}

	// Assign to admin
	async assignToAdmin(userOrUserUuids: string | string[]) {
		if (Array.isArray(userOrUserUuids)) {
			// Bulk update

			return await this.table.updateMany({
				where: {
					id: {
						in: userOrUserUuids,
					},
				},
				data: {
					user_level: USER_LEVEL.ADMIN,
				},
			});
		}

		// Single Update
		return await this.table.update({
			where: {
				id: userOrUserUuids,
			},
			data: {
				user_level: USER_LEVEL.ADMIN,
			},
		});
	}

	// Unassign from admin
	async removeFromAdmin(userOrUserUuids: string | string[]) {
		if (Array.isArray(userOrUserUuids)) {
			// Bulk update

			return await this.table.updateMany({
				where: {
					id: {
						in: userOrUserUuids,
					},
				},
				data: {
					user_level: USER_LEVEL.MEMBER,
				},
			});
		}

		// Single Update
		return await this.table.update({
			where: {
				id: userOrUserUuids,
			},
			data: {
				user_level: USER_LEVEL.MEMBER,
			},
		});
	}
}
