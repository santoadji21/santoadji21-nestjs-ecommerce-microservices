import { z } from "zod";

export const mediasEnvSchema = z.object({
	MONGO_URI: z.string().url({
		message: "Invalid database url",
	}),
	MONGO_USER: z.string(),
	MONGO_PASSWORD: z.string(),
	AWS_REGION: z.string().default("ap-southeast-1"),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_ENDPOINT: z.string(),
	AWS_URL: z.string(),
	AWS_S3_BUCKET_NAME: z.string(),
});

export type MediasEnv = z.infer<typeof mediasEnvSchema>;
