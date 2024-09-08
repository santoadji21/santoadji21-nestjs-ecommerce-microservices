import { SERVICES } from "@app/common/constants/services/services";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { ResponseInterceptorsModule } from "@app/common/interceptors/response/response.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { stockEnvSchema } from "apps/stock/src/env/env";
import { StockEnvModule } from "apps/stock/src/env/env.module";
import { StockEnvService } from "apps/stock/src/env/env.service";

@Module({
	imports: [
		PinoCustomLoggerModule,
		ConfigModule.forRoot({
			validate: (env) => stockEnvSchema.parse(env),
			isGlobal: true,
		}),
		ClientsModule.registerAsync([
			{
				imports: [StockEnvModule],
				inject: [StockEnvService],
				name: SERVICES.AUTH,
				useFactory: (stockEnv: StockEnvService) => ({
					transport: Transport.TCP,
					options: {
						host: stockEnv.get("AUTH_HOST"),
						port: stockEnv.get("AUTH_PORT"),
					},
				}),
			},
			{
				name: SERVICES.NOTIFICATION,
				imports: [StockEnvModule],
				inject: [StockEnvService],
				useFactory: (stockEnv: StockEnvService) => ({
					transport: Transport.NATS,
					options: {
						servers: [
							`nats://${stockEnv.get("NATS_HOST")}:${stockEnv.get("NATS_PORT")}`,
						],
					},
				}),
			},
		]),
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		ResponseInterceptorsModule,
	],
	exports: [
		PinoCustomLoggerModule,
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		ResponseInterceptorsModule,
		ConfigModule,
		ClientsModule,
	],
})
export class CommonStockModule {}
