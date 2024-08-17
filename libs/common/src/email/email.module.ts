import { EmailConfigurableModuleClass } from "@app/common/email/config/email-module-definition";
import { EmailService } from "@app/common/email/email.service";
import { Module } from "@nestjs/common";

@Module({
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule extends EmailConfigurableModuleClass {}
