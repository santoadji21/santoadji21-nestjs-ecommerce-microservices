import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);

const indonesianPhoneRegex = new RegExp(/^(?:\+62|62|0)8[1-9][0-9]{6,9}$/);

export const CreateUserDtoSchema = z
	.object({
		name: z
			.string()
			.openapi({ example: "John Doe", description: "The name of the user" }),
		phone: z
			.string()
			.regex(indonesianPhoneRegex, { message: "Invalid phone number" })
			.optional()
			.openapi({
				example: "081234567890",
				description: "The phone number of the user",
			}),
		email: z.string().email({ message: "Invalid email address" }).openapi({
			example: "johndoe@example.com",
			description: "The email address of the user",
		}),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" })
			.openapi({
				example: "securepassword",
				description: "The password of the user",
			}),
	})
	.openapi("CreateUserDto")
	.strict();

export const LoginUserDtoSchema = CreateUserDtoSchema.pick({
	email: true,
	password: true,
}).openapi("LoginUserDto");

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export const UserResponseDtoSchema = CreateUserDtoSchema.omit({
	password: true,
});

export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;

export type UserLoginDto = z.infer<typeof LoginUserDtoSchema>;

export type UpdateUserDto = Partial<CreateUserDto>;
