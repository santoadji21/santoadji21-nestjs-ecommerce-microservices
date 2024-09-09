import { globalEnvSchema } from "@app/common/env/env";
import { z } from "zod";

export const shippingEnvSchema = z
	.object({
		PORT: z.coerce.number().optional().default(3000),
		DATABASE_URL: z.string().url({
			message: "Invalid database url",
		}),
		AUTH_HOST: z.string(),
		AUTH_PORT: z.coerce.number(),
	})
	.merge(globalEnvSchema);

export type ShippingEnv = z.infer<typeof shippingEnvSchema>;
