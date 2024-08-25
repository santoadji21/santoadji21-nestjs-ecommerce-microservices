import { UserEnvModule } from "@app/user/env/env.module";
import { UserEnvService } from "@app/user/env/env.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [UserEnvModule],
			inject: [UserEnvService],
			useFactory: async (userEnc: UserEnvService) => ({
				secret: userEnc.get("JWT_SECRET"),
				signOptions: { expiresIn: userEnc.get("JWT_EXPIRATION_TIME") },
			}),
		}),
	],
	exports: [JwtModule],
})
export class JwtConfigModule {}
