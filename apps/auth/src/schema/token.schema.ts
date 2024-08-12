import { z } from "zod";

export const TokenPayloadSchema = z.object({
	email: z.string().email(),
	id: z.string().uuid(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
