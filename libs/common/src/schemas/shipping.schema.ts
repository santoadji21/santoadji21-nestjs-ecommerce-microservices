import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);
export const ShippingDataNotificationSchema = z.object({
	shipping_id: z.string().uuid().openapi({
		example: "3dbaa2b6-879e-4f40-a546-54bee09e7062",
		description: "The UUID of the shipping",
	}),
});

export type ShippingDataNotification = z.infer<
	typeof ShippingDataNotificationSchema
>;
