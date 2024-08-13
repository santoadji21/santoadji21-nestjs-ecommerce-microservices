import "tsconfig-paths/register";
import { NestFactory } from "@nestjs/core";

import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { ProductsModule } from "@app/products/products.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(ProductsModule);
	app.use(cookieParser());
	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(3000);
}
bootstrap();
