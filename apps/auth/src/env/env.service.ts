import { AuthEnv } from "@app/auth/env/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthEnvService {
	constructor(private configService: ConfigService<AuthEnv, true>) {}

	get<T extends keyof AuthEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
