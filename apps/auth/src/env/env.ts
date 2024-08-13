import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().optional().default(3000),
	DATABASE_URL: z.string().url({
		message: "Invalid database url",
	}),
	JWT_EXPIRATION_TIME: z.coerce.number().or(z.string()),
	JWT_SECRET: z.string(),
	TCP_PORT: z.coerce.number().optional().default(3001),
});

export type Env = z.infer<typeof envSchema>;
