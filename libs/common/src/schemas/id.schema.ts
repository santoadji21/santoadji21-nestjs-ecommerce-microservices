import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const IdSchema = z
	.object({
		id: z.string().uuid().openapi({
			example: "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7g6h5i4j",
			description: "The UUID of the product",
		}),
	})
	.strict();

export type Id = z.infer<typeof IdSchema>;
