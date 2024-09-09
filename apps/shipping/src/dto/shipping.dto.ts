import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { SHIPPING_STATUS } from "@prisma/client";
import { z } from "zod";

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

export const UpdateShippingDtoSchema = z.object({
	adm_notes: z.string().optional().openapi({
		example: "Menggunakan buble wrap",
		description: "Administrative notes regarding the shipping",
	}),
	shipping_no: z.string().optional().openapi({
		example: "123123123123",
		description: "The shipping number",
	}),
	courier_phone: z.string().optional().openapi({
		example: "123123",
		description: "The courier's phone number",
	}),
	courier_name: z.string().optional().openapi({
		example: "Jhon",
		description: "The name of the courier",
	}),
	shipping_status: z
		.enum([
			SHIPPING_STATUS.PENDING,
			SHIPPING_STATUS.FAILED,
			SHIPPING_STATUS.DONE,
		])
		.openapi({
			example: SHIPPING_STATUS.PENDING,
			description: "The status of the shipping",
		}),
});

export type UpdateShippingDto = z.infer<typeof UpdateShippingDtoSchema>;
