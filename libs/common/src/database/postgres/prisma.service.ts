import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaPostgresService
	extends PrismaClient
	implements OnModuleInit
{
	async onModuleInit() {
		try {
			await this.$connect();
			console.log("Connected to the database.");
		} catch (error) {
			console.log(error);
			console.log("Error connecting to the database.");
		}
	}
	async onModuleDestroy() {
		await this.$disconnect();
	}
}
