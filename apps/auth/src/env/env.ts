import { globalEnvSchema } from "@app/common/env/env";
import { z } from "zod";

export const authEnvSchema = z
	.object({
		PORT: z.coerce.number().optional().default(3000),
		DATABASE_URL: z.string().url({
			message: "Invalid database url",
		}),
		JWT_EXPIRATION_TIME: z.coerce.number().or(z.string()),
		JWT_SECRET: z.string(),
		TCP_PORT: z.coerce.number().optional().default(3001),
		AWS_REGION: z.string().default("ap-southeast-1"),
		AWS_ACCESS_KEY_ID: z.string(),
		AWS_SECRET_ACCESS_KEY: z.string(),
		SES_EMAIL_SOURCE: z.string().email({ message: "Invalid email address" }),
		FRONTEND_URL: z.string().url({
			message: "Invalid domain",
		}),
		SALT_ROUNDS: z.coerce.number().default(10),
	})
	.merge(globalEnvSchema);

export type AuthEnv = z.infer<typeof authEnvSchema>;
