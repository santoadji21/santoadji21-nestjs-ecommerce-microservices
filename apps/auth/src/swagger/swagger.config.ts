import {
	CreateUserDtoSchema,
	LoginUserDtoSchema,
} from "@app/auth/dto/user.dto";
import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";

export function getSwaggerConfig(): OpenAPIObject {
	// Create a registry and register your schemas
	const registry = new OpenAPIRegistry();
	registry.register("Register", CreateUserDtoSchema);
	registry.register("Login", LoginUserDtoSchema);

	// Generate the OpenAPI components from zod-to-openapi
	const generator = new OpenApiGeneratorV3(registry.definitions);
	const zodComponents = generator.generateComponents();

	// Create Swagger config using DocumentBuilder
	const swaggerConfig = new DocumentBuilder()
		.setTitle("Auth Services")
		.setDescription("Auth data, register, login")
		.setVersion("1.0")
		.addTag("auth-services")
		.addServer("/auth")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
			"accessToken",
		)
		.build();

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(swaggerConfig as any).components = {
		...(swaggerConfig.components || {}),
		schemas: {
			...(swaggerConfig.components?.schemas || {}),
			...zodComponents.components?.schemas,
		},
	};

	return swaggerConfig as OpenAPIObject;
}
