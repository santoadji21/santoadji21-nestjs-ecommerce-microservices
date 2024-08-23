import { ConfigurableModuleBuilder } from "@nestjs/common";
import { z } from "zod";

export const S3ModuleOptionsSchema = z.object({
	region: z.string(),
	aws_access_key_id: z.string(),
	aws_secret_access_key: z.string(),
	bucket: z.string(),
	endpoint: z.string().optional(),
	forcePathStyle: z.boolean().optional(),
	url: z.string().optional(),
});

export type S3ModuleOptions = z.infer<typeof S3ModuleOptionsSchema>;

export const {
	ConfigurableModuleClass: S3ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN: S3_MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<S3ModuleOptions>().build();
