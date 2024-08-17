import { ConfigurableModuleBuilder } from "@nestjs/common";
import { z } from "zod";

export const EmailModuleOptionsSchema = z.object({
	region: z.string(),
	aws_access_key_id: z.string(),
	aws_secret_access_key: z.string(),
});

export type EmailModuleOptions = z.infer<typeof EmailModuleOptionsSchema>;

export const {
	ConfigurableModuleClass: EmailConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN: EMAIL_MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<EmailModuleOptions>().build();
