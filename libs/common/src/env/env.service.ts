import { GlobalEnv } from "@app/common/env/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GlobalEnvService {
	constructor(private configService: ConfigService<GlobalEnv, true>) {}

	get<T extends keyof GlobalEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
