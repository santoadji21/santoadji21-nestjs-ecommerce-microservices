import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

interface ErrorResponse {
	statusCode: number;
	message: string | string[];
	error?: string;
	errors?: unknown;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception.getStatus
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseContent = exception.getResponse();

		// Type guard for the responseContent
		const isErrorResponse = (
			responseContent: unknown,
		): responseContent is ErrorResponse => {
			return (
				typeof responseContent === "object" &&
				responseContent !== null &&
				"message" in responseContent
			);
		};

		let message: string | string[] = exception.message;
		let errors: unknown = null;

		// If the response content is an object and has a message, use it
		if (isErrorResponse(responseContent)) {
			message = responseContent.message;
			errors = responseContent.errors ?? null;
		}

		console.log("message");
		console.log("Calling Exception");

		response.status(status).json({
			statusCode: status,
			message,
			data: null, // Error responses do not contain data
			error: true,
			errors, // Include any additional error details
			path: request.url,
		});
	}
}
