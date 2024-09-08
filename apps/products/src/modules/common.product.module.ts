import { AUTH_SERVICE } from "@app/common/constants/services/services";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { ResponseInterceptorsModule } from "@app/common/interceptors/response/response.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { PostgresRepositoriesModule } from "@app/common/repositories/postgres/postgres.repository.module";
import { ProductEnvModule } from "@app/products/env/env.module";
import { ProductEnvService } from "@app/products/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ClientsModule.registerAsync([
			{
				imports: [ProductEnvModule],
				inject: [ProductEnvService],
				name: AUTH_SERVICE,
				useFactory: (productEnv: ProductEnvService) => ({
					transport: Transport.TCP,
					options: {
						host: productEnv.get("AUTH_HOST"),
						port: productEnv.get("AUTH_PORT"),
					},
				}),
			},
		]),
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		ResponseInterceptorsModule,
		PinoCustomLoggerModule,
	],
	exports: [
		PrismaPostgresModule,
		PostgresRepositoriesModule,
		ResponseInterceptorsModule,
		PinoCustomLoggerModule,
		ConfigModule,
		ClientsModule,
	],
})
export class CommonProductModule {}
