import "tsconfig-paths/register";

import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { ShippingModule } from "@app/shipping/shipping.module";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

async function bootstrap() {
	const app = await NestFactory.create(ShippingModule);

	app.use(cookieParser());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useLogger(app.get(Logger));
	await app.listen(3000);
}
bootstrap();
