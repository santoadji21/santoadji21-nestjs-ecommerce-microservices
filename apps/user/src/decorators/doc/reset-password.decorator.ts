import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";

export function ResetPasswordDoc() {
	return applyDecorators(
		ApiOperation({
			summary: "Send reset password",
			description: "Send reset password via email",
		}),
		ApiParam({ name: "email" }),
	);
}
