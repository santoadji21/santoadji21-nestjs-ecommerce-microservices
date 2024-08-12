import { ForgotPasswordRepository } from "@app/common/repositories/postgres/forgot-password.repository";
import { OrderItemRepository } from "@app/common/repositories/postgres/order-item.repository";
import { OrderRepository } from "@app/common/repositories/postgres/order.repository";
import { PaymentRepository } from "@app/common/repositories/postgres/payment.repository";
import { ProductRepository } from "@app/common/repositories/postgres/product.repository";
import { ShippingRepository } from "@app/common/repositories/postgres/shipping.repository";
import { StockHistoryRepository } from "@app/common/repositories/postgres/stock-history.repository";
import { StockRepository } from "@app/common/repositories/postgres/stock.repository";
import { UserRepository } from "@app/common/repositories/postgres/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostgresRepositoriesService {
	constructor(
		private readonly userRepos: UserRepository,
		private readonly orderRepos: OrderRepository,
		private readonly orderItemRepos: OrderItemRepository,
		private readonly paymentRepos: PaymentRepository,
		private readonly shippingRepos: ShippingRepository,
		private readonly stockRepos: StockRepository,
		private readonly stockHistoryRepos: StockHistoryRepository,
		private readonly productRepos: ProductRepository,
		private readonly forgotPasswordRepository: ForgotPasswordRepository,
	) {}

	get userRepository() {
		return this.userRepos;
	}

	get orderRepository() {
		return this.orderRepos;
	}

	get orderItemRepository() {
		return this.orderItemRepos;
	}

	get paymentRepository() {
		return this.paymentRepos;
	}

	get shippingRepository() {
		return this.shippingRepos;
	}

	get stockRepository() {
		return this.stockRepos;
	}

	get stockHistoryRepository() {
		return this.stockHistoryRepos;
	}

	get productRepository() {
		return this.productRepos;
	}

	get forgotPassword() {
		return this.forgotPasswordRepository;
	}
}
