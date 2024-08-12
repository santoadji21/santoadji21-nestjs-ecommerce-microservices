import { EnvService } from "@app/auth/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [EnvService],
	exports: [EnvService],
})
export class EnvModule {}
