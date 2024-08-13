import { z } from "zod";

export const globalEnvSchema = z.object({
	NATS_HOST: z.string({
		message: "Invalid NATS url",
	}),
	NATS_PORT: z.coerce.number(),
});

export type GlobalEnv = z.infer<typeof globalEnvSchema>;
