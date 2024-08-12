import { AuthModule } from "@app/auth/auth.module";
import { getSwaggerConfig } from "@app/auth/swagger/swagger.config";
import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);

	// Parse cookies
	app.use(cookieParser());
	// Get the Swagger configuration
	const swaggerConfig = getSwaggerConfig();

	// Generate the base Swagger document
	const document = SwaggerModule.createDocument(app, swaggerConfig);

	// Set up Swagger with the document
	SwaggerModule.setup("swagger", app, document);

	// Apply global filters
	app.useGlobalFilters(new HttpExceptionFilter());

	await app.listen(3000);
}

bootstrap();
