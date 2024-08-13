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
	})
	.merge(globalEnvSchema);

export type AuthEnv = z.infer<typeof authEnvSchema>;
