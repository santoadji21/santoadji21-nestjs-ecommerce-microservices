import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().optional().default(3000),
	DATABASE_URL: z.string().url({
		message: "Invalid database url",
	}),
	JWT_EXPIRATION_TIME: z.coerce.number().or(z.string()).default(3600),
	JWT_SECRET: z.string().default("secret"),
});

export type Env = z.infer<typeof envSchema>;
