import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { UserEnvService } from "@app/user/env/env.service";
import { getSwaggerConfig } from "@app/user/swagger/swagger.config";
import { UserModule } from "@app/user/user.module";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

async function bootstrap() {
	const app = await NestFactory.create(UserModule);
	const authEnv = app.get(UserEnvService);
	// Parse cookies
	app.use(cookieParser());

	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: "0.0.0.0",
			port: authEnv.get("TCP_PORT"),
		},
	});

	// Get the Swagger configuration
	const swaggerConfig = getSwaggerConfig();
	// Generate the base Swagger document
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	// Set up Swagger with the document
	SwaggerModule.setup("swagger", app, document);
	// Apply global filters
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useLogger(app.get(Logger));

	const port = authEnv.get("PORT");
	await app.startAllMicroservices();
	await app.listen(port);
}

bootstrap();
