import { AuthEnvService } from "@app/auth/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [AuthEnvService],
	exports: [AuthEnvService],
})
export class AuthEnvModule {}
