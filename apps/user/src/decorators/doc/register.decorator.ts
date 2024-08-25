import { RegisterUserExample } from "@app/user/swagger/example";
import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function RegisterUserDoc() {
	return applyDecorators(
		ApiOperation({
			summary: "Register user",
			description: "Register new user",
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "The record has been successfully created.",
			schema: {
				example: RegisterUserExample,
			},
		}),
	);
}
