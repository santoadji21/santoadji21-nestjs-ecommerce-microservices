import { EnvModule } from "@app/auth/env/env.module";
import { EnvService } from "@app/auth/env/env.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			useFactory: async (envService: EnvService) => ({
				secret: envService.get("JWT_SECRET"),
				signOptions: { expiresIn: envService.get("JWT_EXPIRATION_TIME") },
			}),
		}),
	],
	exports: [JwtModule],
})
export class JwtConfigModule {}
