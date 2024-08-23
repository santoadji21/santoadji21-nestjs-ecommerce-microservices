import { MediasEnv } from "@app/medias/env/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MediasEnvService {
	constructor(private configService: ConfigService<MediasEnv, true>) {}

	get<T extends keyof MediasEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
