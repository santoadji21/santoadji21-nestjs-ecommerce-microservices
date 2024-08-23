import "tsconfig-paths/register";
import { HttpExceptionFilter } from "@app/common/filters/http-exception/http-exception.filter";
import { MediasModule } from "@app/medias/medias.module";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

async function bootstrap() {
	const app = await NestFactory.create(MediasModule);

	app.useGlobalFilters(new HttpExceptionFilter());
	app.useLogger(app.get(Logger));
	await app.listen(3000);
}
bootstrap();
