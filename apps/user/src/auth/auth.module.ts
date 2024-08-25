import { AuthController } from "@app/user/auth/auth.controller";
import { AuthService } from "@app/user/auth/auth.service";
import { userEnvSchema } from "@app/user/env/env";
import { CommonUserModule } from "@app/user/modules/common.user.module";
import { JwtStrategy } from "@app/user/strategies/jwt.strategy";
import { LocalStrategy } from "@app/user/strategies/local.strategy";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		CommonUserModule,
		ConfigModule.forRoot({
			validate: (env) => userEnvSchema.parse(env),
			isGlobal: true,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
