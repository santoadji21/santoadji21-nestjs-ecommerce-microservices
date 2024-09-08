import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import {
	CreateAdminProductDto,
	UpdateAdminProductDto,
} from "@app/products/admin/dto/product.dto";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ProductService {
	constructor(private readonly repos: PostgresRepositoriesService) {}
	async create(createAdminProductDto: CreateAdminProductDto) {
		return await this.repos.productRepository.create(createAdminProductDto);
	}

	async findAll(user_id: string) {
		return await this.repos.productRepository.findAllByUser(user_id);
	}

	async findOne(id: string) {
		const product = await this.repos.productRepository.findOneById(id);

		if (!product) {
			throw new NotFoundException("Product not found");
		}
		return product;
	}

	async update(id: string, updateAdminProductDto: UpdateAdminProductDto) {
		const product = await this.findOne(id);
		await this.repos.productRepository.update(
			product.id,
			updateAdminProductDto,
		);
	}

	async remove(id: string) {
		const product = await this.findOne(id);
		await this.repos.productRepository.remove(product.id);
	}
}
