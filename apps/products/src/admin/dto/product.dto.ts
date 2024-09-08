import { IdSchema } from "@app/common/schemas/id.schema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Define the schema for Prisma.userCreateNestedOneWithoutProductInput if needed
export const userCreateNestedOneWithoutProductInputSchema = z
	.object({
		connect: z
			.object({
				id: z.string().uuid().openapi({
					example: "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7g6h5i4j",
					description: "The UUID of the user to connect",
				}),
			})
			.optional(),
		create: z
			.object({
				id: z.string().uuid().optional().openapi({
					example: "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7g6h5i4j",
					description: "The UUID of the user, auto-generated if not provided",
				}),
				name: z.string().min(1, "Name is required").openapi({
					example: "John Doe",
					description: "The name of the user",
				}),
				email: z.string().email("Invalid email address").openapi({
					example: "johndoe@example.com",
					description: "The email address of the user",
				}),
				password: z
					.string()
					.min(6, "Password must be at least 6 characters long")
					.openapi({
						example: "securepassword",
						description: "The password of the user",
					}),
				phone: z.string().optional().openapi({
					example: "081234567890",
					description: "The phone number of the user",
				}),
				avatar: z.string().optional().openapi({
					example: "avatar.png",
					description: "The avatar image filename of the user",
				}),
				avatar_media_id: z.string().optional().openapi({
					example: "66c1574c1560f6e6d335c344",
					description: "The media ID of the avatar",
				}),
				user_level: z.enum(["MEMBER", "ADMIN"]).optional().openapi({
					example: "MEMBER",
					description: "The level of the user",
				}),
				created_at: z.date().optional().default(new Date()).openapi({
					example: new Date().toISOString(),
					description: "The creation date of the user",
				}),
				updated_at: z.date().optional().default(new Date()).openapi({
					example: new Date().toISOString(),
					description: "The last update date of the user",
				}),
			})
			.optional(),
	})
	.strict();

// Define the CreateAdminProductDto schema
export const CreateAdminProductDtoSchema = z
	.object({
		product_name: z.string().min(1, "Product name is required").openapi({
			example: "Jeruk",
			description: "The name of the product",
		}),
		slug: z.string().min(1, "Slug is required").openapi({
			example: "jeruk-manis",
			description: "The slug for the product URL",
		}),
		description: z.string().min(1, "Description is required").openapi({
			example: "Jeruk manis",
			description: "The description of the product",
		}),
		price: z.number().optional().openapi({
			example: 10000,
			description: "The price of the product",
		}),
		product_image_id: z.string().optional().openapi({
			example: "66c1574c1560f6e6d335c344",
			description: "The ID of the product image",
		}),
		product_image: z.string().optional().openapi({
			example: "abc.png",
			description: "The filename of the product image",
		}),
		is_active: z.boolean().optional().openapi({
			example: true,
			description: "Indicates if the product is active",
		}),
		created_by_id: z
			.string()
			.optional()
			.openapi({
				example: "user-uuid",
				description: "The ID of the user who created the product",
			})
			.optional(),
		created_by: userCreateNestedOneWithoutProductInputSchema
			.openapi({
				description: "Nested object containing user creation details",
			})
			.optional(),
	})
	.openapi("CreateAdminProductDto")
	.strict();

export const ProductByIdSchema = IdSchema;

export const UpdateAdminProductDtoSchema = CreateAdminProductDtoSchema.partial()
	.openapi({
		description: "Partial Update of CreateAdminProductDto",
	})
	.strict();

export type CreateAdminProductDto = z.infer<typeof CreateAdminProductDtoSchema>;

export type UpdateAdminProductDto = Partial<CreateAdminProductDto>;

export type ProductByIdDto = z.infer<typeof ProductByIdSchema>;
