import { AuthController } from "@app/auth/auth.controller";
import { AuthService } from "@app/auth/auth.service";
import { envSchema } from "@app/auth/env/env";
import { AuthEnvModule } from "@app/auth/env/env.module";
import { InterceptorsModule } from "@app/auth/modules/interceptors.module";
import { JwtConfigModule } from "@app/auth/modules/jwt-config.module";
import { JwtStrategy } from "@app/auth/strategies/jwt.strategy";
import { LocalStrategy } from "@app/auth/strategies/local.strategy";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		AuthEnvModule,
		JwtConfigModule,
		InterceptorsModule,
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		PinoCustomLoggerModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
