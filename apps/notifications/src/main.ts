import "tsconfig-paths/register";
import { GlobalEnvService } from "@app/common/env/env.service";
import { NotificationsModule } from "@app/notifications/notifications.module";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
	const app = await NestFactory.create(NotificationsModule);
	const globalEnv = app.get(GlobalEnvService);

	const microserviceOptions: MicroserviceOptions = {
		transport: Transport.NATS,
		options: {
			servers: [
				`nats://${globalEnv.get("NATS_HOST")}:${globalEnv.get("NATS_PORT")}`,
			],
		},
	};

	const notifications = await NestFactory.createMicroservice(
		NotificationsModule,
		microserviceOptions,
	);

	await notifications.listen();
}

bootstrap();
