import { PrismaPostgresService } from "@app/common/database/postgres";
import { Module } from "@nestjs/common";

@Module({
	providers: [PrismaPostgresService],
	exports: [PrismaPostgresService],
})
export class PrismaPostgresModule {}
