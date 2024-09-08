import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StockEnv } from "apps/stock/src/env/env";

@Injectable()
export class StockEnvService {
	constructor(private configService: ConfigService<StockEnv, true>) {}

	get<T extends keyof StockEnv>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
