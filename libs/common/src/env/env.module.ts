import { GlobalEnvService } from "@app/common/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [GlobalEnvService],
	exports: [GlobalEnvService],
})
export class GlobalEnvModule {}
