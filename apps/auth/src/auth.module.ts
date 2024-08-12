import { AuthController } from "@app/auth/auth.controller";
import { AuthService } from "@app/auth/auth.service";
import { envSchema } from "@app/auth/env/env";
import { EnvModule } from "@app/auth/env/env.module";
import { EnvService } from "@app/auth/env/env.service";
import { JwtStrategy } from "@app/auth/strategies/jwt.strategy";
import { LocalStrategy } from "@app/auth/strategies/local.strategy";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { TransformInterceptor } from "@app/common/interceptors/response/response.interceptor";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			useFactory: async (envService: EnvService) => ({
				secret: envService.get("JWT_SECRET"),
				signOptions: { expiresIn: envService.get("JWT_EXPIRATION_TIME") },
			}),
		}),
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		PinoCustomLoggerModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		EnvService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		LocalStrategy,
		JwtStrategy,
	],
	exports: [AuthService, JwtModule, EnvService],
})
export class AuthModule {}
