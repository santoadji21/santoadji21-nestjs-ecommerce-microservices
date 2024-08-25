import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserEnv } from "apps/user/src/env/env";

@Injectable()
export class UserEnvService {
	constructor(private configService: ConfigService<UserEnv, true>) {}

	get<T extends keyof UserEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
