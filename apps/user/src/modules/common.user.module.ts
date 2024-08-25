import { PrismaPostgresModule } from "@app/common/database/postgres";
import { ResponseInterceptorsModule } from "@app/common/interceptors/response/response.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { UserEnvModule } from "@app/user/env/env.module";
import { JwtConfigModule } from "@app/user/modules/jwt-config.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		UserEnvModule,
		JwtConfigModule,
		ResponseInterceptorsModule,
		PinoCustomLoggerModule,
	],
	exports: [
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		UserEnvModule,
		JwtConfigModule,
		ResponseInterceptorsModule,
		PinoCustomLoggerModule,
	],
})
export class CommonUserModule {}
