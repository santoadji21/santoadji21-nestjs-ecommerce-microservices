import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);

export const addStockSchema = z.object({
	product_id: z.string().min(1, "Product ID is required").openapi({
		example: "product-uuid",
		description: "The ID of the product",
	}),
	amount: z.number().min(1, "Amount must be a positive number").openapi({
		example: 100,
		description: "The amount of stock to add",
	}),
	notes: z.string().optional().openapi({
		example: "Stock produk import",
		description: "Optional notes regarding the stock",
	}),
	user_id: z.string().min(1, "User ID is required").openapi({
		example: "user-uuid",
		description: "The ID of the user who is adding the stock",
	}),
});

export const updateStockSchema = addStockSchema.optional();

export type AddStockDto = z.infer<typeof addStockSchema>;

export type UpdateStockDto = z.infer<typeof updateStockSchema>;
