import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { RoleGuard } from "@app/common/auth/role-auth.guard";
import { Roles, ZodValidation } from "@app/common/decorators";
import {
	CreateAdminProductDto,
	CreateAdminProductDtoSchema,
	ProductByIdDto,
	ProductByIdSchema,
	UpdateAdminProductDto,
	UpdateAdminProductDtoSchema,
} from "@app/products/admin/dto/product.dto";
import { ProductService } from "@app/products/admin/product.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import { USER_LEVEL } from "@prisma/client";

@Controller("admin")
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(USER_LEVEL.ADMIN)
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@HttpCode(HttpStatus.OK)
	@Post()
	@ZodValidation(CreateAdminProductDtoSchema)
	async create(
		@Body() createAdminProductDto: CreateAdminProductDto,
		@Request() req,
	) {
		createAdminProductDto.created_by_id = req.user.id;
		const createProduct = await this.productService.create(
			createAdminProductDto,
		);
		return {
			data: createProduct,
			message: "create product success",
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	async findAll(@Request() req) {
		const products = await this.productService.findAll(req.user.id);
		return {
			data: products,
			message: "get all product active",
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get(":id")
	@ZodValidation(ProductByIdSchema)
	async findOne(@Param() params: ProductByIdDto) {
		const product = await this.productService.findOne(params.id);
		return {
			data: product,
			message: "get product by id",
		};
	}

	@HttpCode(HttpStatus.OK)
	@Patch(":id")
	@ZodValidation(UpdateAdminProductDtoSchema)
	async update(
		@Param() params: ProductByIdDto,
		@Body() body: UpdateAdminProductDto,
	) {
		const updateProduct = await this.productService.update(params.id, body);
		return {
			data: updateProduct,
			message: "update product success",
		};
	}

	@HttpCode(HttpStatus.OK)
	@Delete(":id")
	@ZodValidation(ProductByIdSchema)
	async remove(@Param() params: ProductByIdDto) {
		const removeProduct = await this.productService.remove(params.id);
		return {
			data: removeProduct,
			message: "remove product success",
		};
	}
}
