import { AuthController } from "@app/auth/auth.controller";
import { AuthService } from "@app/auth/auth.service";
import { authEnvSchema } from "@app/auth/env/env";
import { AuthEnvModule } from "@app/auth/env/env.module";
import { AuthEnvService } from "@app/auth/env/env.service";
import { InterceptorsModule } from "@app/auth/modules/interceptors.module";
import { JwtConfigModule } from "@app/auth/modules/jwt-config.module";
import { JwtStrategy } from "@app/auth/strategies/jwt.strategy";
import { LocalStrategy } from "@app/auth/strategies/local.strategy";
import { NOTIFICATION_SERVICE } from "@app/common/constants/services/services";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { EmailModule } from "@app/common/email/email.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		AuthEnvModule,
		JwtConfigModule,
		InterceptorsModule,
		ConfigModule.forRoot({
			validate: (env) => authEnvSchema.parse(env),
			isGlobal: true,
		}),
		EmailModule.registerAsync({
			imports: [AuthEnvModule],
			inject: [AuthEnvService],
			useFactory: (authEnv: AuthEnvService) => ({
				region: authEnv.get("AWS_REGION"),
				aws_access_key_id: authEnv.get("AWS_ACCESS_KEY_ID"),
				aws_secret_access_key: authEnv.get("AWS_SECRET_ACCESS_KEY"),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: NOTIFICATION_SERVICE,
				imports: [AuthEnvModule],
				inject: [AuthEnvService],
				useFactory: (authEnv: AuthEnvService) => ({
					transport: Transport.NATS,
					options: {
						servers: [
							`nats://${authEnv.get("NATS_HOST")}:${authEnv.get("NATS_PORT")}`,
						],
					},
				}),
			},
		]),
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		PinoCustomLoggerModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
