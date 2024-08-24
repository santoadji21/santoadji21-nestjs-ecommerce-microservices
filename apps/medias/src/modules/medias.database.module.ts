import {
	MediaDocument,
	MediaSchema,
} from "@app/medias/document/medias.document";
import { MediasEnvModule } from "@app/medias/env/env.module";
import { MediasEnvService } from "@app/medias/env/env.service";
import { MediaRepository } from "@app/medias/repository/media.repository";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		MediasEnvModule,
		MongooseModule.forRootAsync({
			imports: [MediasEnvModule],
			inject: [MediasEnvService],
			useFactory: (mediasEnvService: MediasEnvService) => {
				const uri = mediasEnvService.get("MONGO_URI");
				return {
					uri,
					useNewUrlParser: true,
					useUnifiedTopology: true,
					authSource: "admin",
					auth: {
						username: mediasEnvService.get("MONGO_USER"),
						password: mediasEnvService.get("MONGO_PASSWORD"),
					},
				};
			},
		}),
		MongooseModule.forFeature([
			{ name: MediaDocument.name, schema: MediaSchema },
		]),
	],
	providers: [MediaRepository],
	exports: [MediaRepository],
})
export class MediasDatabaseModule {}
