import { TransformInterceptor } from "@app/common/interceptors/response/response.interceptor";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
	],
})
export class InterceptorsModule {}
