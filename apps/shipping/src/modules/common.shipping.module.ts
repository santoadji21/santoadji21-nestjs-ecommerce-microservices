import { SERVICES } from "@app/common/constants/services/services";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { ResponseInterceptorsModule } from "@app/common/interceptors/response/response.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { shippingEnvSchema } from "@app/shipping/env/env";
import { ShippingEnvModule } from "@app/shipping/env/env.module";
import { ShippingEnvService } from "@app/shipping/env/env.service";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		PinoCustomLoggerModule,
		ConfigModule.forRoot({
			validate: (env) => shippingEnvSchema.parse(env),
			isGlobal: true,
		}),
		ClientsModule.registerAsync([
			{
				imports: [ShippingEnvModule],
				inject: [ShippingEnvService],
				name: SERVICES.AUTH,
				useFactory: (shippingEnv: ShippingEnvService) => ({
					transport: Transport.TCP,
					options: {
						host: shippingEnv.get("AUTH_HOST"),
						port: shippingEnv.get("AUTH_PORT"),
					},
				}),
			},
			{
				name: SERVICES.NOTIFICATION,
				imports: [ShippingEnvModule],
				inject: [ShippingEnvService],
				useFactory: (shippingEnv: ShippingEnvService) => ({
					transport: Transport.NATS,
					options: {
						servers: [
							`nats://${shippingEnv.get("NATS_HOST")}:${shippingEnv.get("NATS_PORT")}`,
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
export class CommonShippingModule {}
