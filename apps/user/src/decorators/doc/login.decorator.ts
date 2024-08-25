import { LoginUserExample } from "@app/user/swagger/example";
import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function LoginUserDoc() {
	return applyDecorators(
		ApiOperation({
			summary: "Login user",
			description: "Login user",
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "The login has been successfully.",
			schema: {
				example: LoginUserExample,
			},
		}),
	);
}
