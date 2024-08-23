import { InterceptorsModule } from "@app/auth/modules/interceptors.module";
import { S3Module } from "@app/common/aws/s3/s3.module";
import { DbMongooseModule } from "@app/common/database/mongo/mongoose.module";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import {
	MediaDocument,
	MediaSchema,
} from "@app/medias/document/medias.document";
import { mediasEnvSchema } from "@app/medias/env/env";
import { MediasEnvModule } from "@app/medias/env/env.module";
import { MediasEnvService } from "@app/medias/env/env.service";
import { MediasController } from "@app/medias/medias.controller";
import { MediasService } from "@app/medias/medias.service";
import { MediaRepository } from "@app/medias/repository/media.repository";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

@Module({
	imports: [
		MediasEnvModule,
		InterceptorsModule,
		PinoCustomLoggerModule,
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
		DbMongooseModule.registerAsync<MediasEnvService>(
			[MediasEnvModule],
			[MediasEnvService],
			(mediasEnvService: MediasEnvService) => {
				const uri = mediasEnvService.get("MONGO_URI");
				return {
					uri,
					...({
						useNewUrlParser: true,
						useUnifiedTopology: true,
					} as Partial<MongooseModuleOptions>),
					options: {
						authSource: "admin",
						auth: {
							username: mediasEnvService.get("MONGO_USER"),
							password: mediasEnvService.get("MONGO_PASSWORD"),
						},
					},
				};
			},
		),
		DbMongooseModule.forFeature([
			{ name: MediaDocument.name, schema: MediaSchema },
		]),
	],
	controllers: [MediasController],
	providers: [MediasService, MediaRepository],
	exports: [MediasService, MediaRepository],
})
export class MediasModule {}
