import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
	constructor(private readonly repos: PostgresRepositoriesService) {}

	async getAll() {
		return await this.repos.productRepository.findAllActive();
	}
}
