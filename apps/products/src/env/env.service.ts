import { ProductEnv } from "@app/products/env/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ProductEnvService {
	constructor(private configService: ConfigService<ProductEnv, true>) {}

	get<T extends keyof ProductEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
