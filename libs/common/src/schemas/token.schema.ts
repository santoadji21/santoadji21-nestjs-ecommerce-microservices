import { z } from "zod";

export const TokenPayloadSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	user_level: z.enum(["ADMIN", "MEMBER"]),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
