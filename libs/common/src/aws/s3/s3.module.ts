import { S3ConfigurableModuleClass } from "@app/common/aws/s3/config/s3-module-definition";
import { S3Service } from "@app/common/aws/s3/s3.service";
import { PinoCustomLoggerModule } from "@app/common/logger/pino-custom-logger.module";
import { Module } from "@nestjs/common";

@Module({
	providers: [S3Service],
	exports: [S3Service],
})
export class S3Module extends S3ConfigurableModuleClass {}
