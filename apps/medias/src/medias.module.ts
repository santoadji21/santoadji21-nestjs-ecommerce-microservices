import { S3Module } from "@app/common/aws/s3/s3.module";
import { ResponseInterceptorsModule } from "@app/common/interceptors/response/response.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { mediasEnvSchema } from "@app/medias/env/env";
import { MediasEnvModule } from "@app/medias/env/env.module";
import { MediasEnvService } from "@app/medias/env/env.service";
import { MediasController } from "@app/medias/medias.controller";
import { MediasService } from "@app/medias/medias.service";
import { MediasDatabaseModule } from "@app/medias/modules/medias.database.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		MediasEnvModule,
		PinoCustomLoggerModule,
		ResponseInterceptorsModule,
		ConfigModule.forRoot({
			validate: (env) => mediasEnvSchema.parse(env),
			isGlobal: true,
		}),
		S3Module.registerAsync({
			imports: [MediasEnvModule],
			inject: [MediasEnvService],
			useFactory: (mediasEnv: MediasEnvService) => ({
				region: mediasEnv.get("AWS_REGION"),
				aws_access_key_id: mediasEnv.get("AWS_ACCESS_KEY_ID"),
				aws_secret_access_key: mediasEnv.get("AWS_SECRET_ACCESS_KEY"),
				endpoint: mediasEnv.get("AWS_ENDPOINT"),
				url: mediasEnv.get("AWS_URL"),
				bucket: mediasEnv.get("AWS_S3_BUCKET_NAME"),
				forcePathStyle: true,
			}),
		}),
		MediasDatabaseModule,
	],
	controllers: [MediasController],
	providers: [MediasService],
	exports: [MediasService],
})
export class MediasModule {}
