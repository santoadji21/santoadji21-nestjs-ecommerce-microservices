import { AuthModule } from "@app/auth/auth.module";
import { AuthEnvService } from "@app/auth/env/env.service";
import { getSwaggerConfig } from "@app/auth/swagger/swagger.config";
import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	const authEnv = app.get(AuthEnvService);
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
