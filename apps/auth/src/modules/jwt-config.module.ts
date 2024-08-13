import { AuthEnvModule } from "@app/auth/env/env.module";
import { AuthEnvService } from "@app/auth/env/env.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [AuthEnvModule],
			inject: [AuthEnvService],
			useFactory: async (authEnv: AuthEnvService) => ({
				secret: authEnv.get("JWT_SECRET"),
				signOptions: { expiresIn: authEnv.get("JWT_EXPIRATION_TIME") },
			}),
		}),
	],
	exports: [JwtModule],
})
export class JwtConfigModule {}
