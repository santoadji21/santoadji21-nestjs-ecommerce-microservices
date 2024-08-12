import { PrismaPostgresModule } from "@app/common/database/postgres";
import { ForgotPasswordRepository } from "@app/common/repositories/postgres/forgot-password.repository";
import { OrderItemRepository } from "@app/common/repositories/postgres/order-item.repository";
import { OrderRepository } from "@app/common/repositories/postgres/order.repository";
import { PaymentRepository } from "@app/common/repositories/postgres/payment.repository";
import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import { ProductRepository } from "@app/common/repositories/postgres/product.repository";
import { ShippingRepository } from "@app/common/repositories/postgres/shipping.repository";
import { StockHistoryRepository } from "@app/common/repositories/postgres/stock-history.repository";
import { StockRepository } from "@app/common/repositories/postgres/stock.repository";
import { UserRepository } from "@app/common/repositories/postgres/user.repository";
import { Module } from "@nestjs/common";

const allPostgresRepositories = [
	UserRepository,
	ProductRepository,
	ShippingRepository,
	OrderItemRepository,
	OrderRepository,
	PaymentRepository,
	StockRepository,
	StockHistoryRepository,
	ForgotPasswordRepository,
	PostgresRepositoriesService,
];

@Module({
	imports: [PrismaPostgresModule],
	providers: [...allPostgresRepositories],
	exports: [...allPostgresRepositories],
})
export class PostgresRepositoriesModule {}
