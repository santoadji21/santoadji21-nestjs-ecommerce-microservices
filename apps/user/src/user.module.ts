import { NOTIFICATION_SERVICE } from "@app/common/constants/services/services";
import { EmailModule } from "@app/common/email/email.module";
import { AuthModule } from "@app/user/auth/auth.module";
import { userEnvSchema } from "@app/user/env/env";
import { UserEnvModule } from "@app/user/env/env.module";
import { UserEnvService } from "@app/user/env/env.service";
import { CommonUserModule } from "@app/user/modules/common.user.module";
import { UserController } from "@app/user/user.controller";
import { UserService } from "@app/user/user.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
	imports: [
		CommonUserModule,
		ConfigModule.forRoot({
			validate: (env) => userEnvSchema.parse(env),
			isGlobal: true,
		}),
		EmailModule.registerAsync({
			imports: [UserEnvModule],
			inject: [UserEnvService],
			useFactory: (authEnv: UserEnvService) => ({
				region: authEnv.get("AWS_REGION"),
				aws_access_key_id: authEnv.get("AWS_ACCESS_KEY_ID"),
				aws_secret_access_key: authEnv.get("AWS_SECRET_ACCESS_KEY"),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: NOTIFICATION_SERVICE,
				imports: [UserEnvModule],
				inject: [UserEnvService],
				useFactory: (authEnv: UserEnvService) => ({
					transport: Transport.NATS,
					options: {
						servers: [
							`nats://${authEnv.get("NATS_HOST")}:${authEnv.get("NATS_PORT")}`,
						],
					},
				}),
			},
		]),
		AuthModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
