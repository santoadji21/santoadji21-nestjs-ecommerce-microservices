import { ShippingEnv } from "@app/shipping/env/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ShippingEnvService {
	constructor(private configService: ConfigService<ShippingEnv, true>) {}

	get<T extends keyof ShippingEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
