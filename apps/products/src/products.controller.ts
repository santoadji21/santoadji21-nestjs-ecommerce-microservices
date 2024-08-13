import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { RoleGuard } from "@app/common/auth/role-auth.guard";
import { Roles } from "@app/common/decorators";
import { ProductsService } from "@app/products/products.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { USER_LEVEL } from "@prisma/client";

@Controller()
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	getHello(): string {
		return this.productsService.getHello();
	}

	@Get("test")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	getHello2() {
		return {
			message: "Hello World!",
		};
	}
}
