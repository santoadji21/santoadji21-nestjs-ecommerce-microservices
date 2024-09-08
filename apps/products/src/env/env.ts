import { z } from "zod";

export const productEnvSchema = z.object({
	PORT: z.coerce.number().optional().default(3000),
	DATABASE_URL: z.string().url({
		message: "Invalid database url",
	}),
	AUTH_HOST: z.string(),
	AUTH_PORT: z.coerce.number(),
});

export type ProductEnv = z.infer<typeof productEnvSchema>;
