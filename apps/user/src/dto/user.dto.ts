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

export const UpdatePasswordDtoSchema = CreateUserDtoSchema.pick({
	password: true,
})
	.extend({
		token: z.string({
			message: "Invalid token",
		}),
	})
	.openapi("UpdatePasswordDto");

export const UserResponseDtoSchema = CreateUserDtoSchema.omit({
	password: true,
});

export const UpdateUserDtoSchema = CreateUserDtoSchema.omit({
	password: true,
})
	.extend({
		id: z.string().uuid().optional().openapi({
			example: "1",
			description: "The id of the user",
		}),
	})
	.optional();

export const DeleteUserSchema = z.object({
	id: z.union([
		z.string().uuid({ message: "Invalid user id" }),
		z.array(z.string().uuid({ message: "Invalid user id" })),
	]),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;

export type UserLoginDto = z.infer<typeof LoginUserDtoSchema>;

export type UpdateUserDto = Partial<CreateUserDto> & {
	id: string;
};

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordDtoSchema>;

export type DeleteUserDto = z.infer<typeof DeleteUserSchema>;
