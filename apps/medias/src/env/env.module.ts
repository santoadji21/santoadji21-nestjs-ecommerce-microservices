import { MediasEnvService } from "@app/medias/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [MediasEnvService],
	exports: [MediasEnvService],
})
export class MediasEnvModule {}
