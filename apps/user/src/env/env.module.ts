import { UserEnvService } from "@app/user/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	providers: [UserEnvService],
	exports: [UserEnvService],
})
export class UserEnvModule {}
