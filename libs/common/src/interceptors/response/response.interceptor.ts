import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { z } from "zod";

export const ResponseSchema = z.object({
	statusCode: z.number(),
	message: z.string(),
	error: z.boolean(),
	errors: z.any(),
	data: z.any(),
	path: z.string(),
});

export type Response<T> = z.infer<typeof ResponseSchema> & { data: T };

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const statusCode = response.statusCode;
		const path = request.url;

		return next.handle().pipe(
			map((responseData) => {
				// Check for a message in the response
				const customMessage = responseData?.message;

				return {
					statusCode,
					message: customMessage,
					data: responseData.data || responseData,
					error: false,
					path,
				};
			}),
			catchError((err) => {
				if (
					err instanceof HttpException &&
					err.getStatus() === HttpStatus.BAD_REQUEST
				) {
					return throwError(() => err);
				}

				// Handle other errors
				const status =
					err instanceof HttpException
						? err.getStatus()
						: HttpStatus.INTERNAL_SERVER_ERROR;
				let message = err.message || "Internal server error";

				if (err.response?.message) {
					message = err.response.message;
				}

				return throwError(
					() =>
						new HttpException(
							{
								statusCode: status,
								message,
								error: true,
								data: null,
								path,
							},
							status,
						),
				);
			}),
		);
	}
}
