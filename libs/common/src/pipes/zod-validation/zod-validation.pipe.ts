import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		// Only validate if the type is not custom
		if (metadata.type !== "custom") {
			try {
				return this.schema.parse(value);
			} catch (error) {
				console.log(error instanceof ZodError);
				if (error instanceof ZodError) {
					const formattedErrors = error.errors.map((err) => {
						let path = err.path?.[0];
						if (err.code === "unrecognized_keys" && "keys" in err) {
							path = err.keys.join(", ");
						}
						const message =
							err.code === "unrecognized_keys"
								? `Invalid keys: ${err.keys.join(", ")}`
								: err.message;

						return {
							path,
							message,
						};
					});

					throw new BadRequestException({
						statusCode: 400,
						message: "Validation failed",
						errors: formattedErrors,
						error: true,
					});
				}
				throw new BadRequestException("Validation failed 2");
			}
		}
		return value;
	}
}
