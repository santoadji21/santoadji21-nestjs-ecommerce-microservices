import "tsconfig-paths/register";

import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { NestFactory } from "@nestjs/core";
import { StockModule } from "apps/stock/src/stock.module";
import * as cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

async function bootstrap() {
	const app = await NestFactory.create(StockModule);

	app.use(cookieParser());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useLogger(app.get(Logger));
	app.startAllMicroservices();
	await app.listen(3000);
}
bootstrap();
