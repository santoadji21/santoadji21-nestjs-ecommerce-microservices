import { PrismaMongoModule } from '@app/common/database/mongo';
import { PrismaPostgresModule } from '@app/common/database/postgres';
import { MediaRepository } from '@app/common/repositories/mongo/media.repository';
import { MongoRepositoriesService } from '@app/common/repositories/mongo/mongo.repositories.service';
import { NotificationRepository } from '@app/common/repositories/mongo/notification.repository';
import { OrderItemRepository } from '@app/common/repositories/postgres/order-item.repository';
import { PostgresRepositoriesService } from '@app/common/repositories/postgres/postgres.repositories.service';
import { ProductRepository } from '@app/common/repositories/postgres/product.repository';
import { ShippingRepository } from '@app/common/repositories/postgres/shipping.repository';
import { UserRepository } from '@app/common/repositories/postgres/user.repository';
import { Module } from '@nestjs/common';

const allPostgresRepositories = [
  UserRepository,
  ProductRepository,
  ShippingRepository,
  OrderItemRepository,
];

const allMongoRepositories = [NotificationRepository, MediaRepository];

@Module({
  imports: [PrismaMongoModule, PrismaPostgresModule],
  providers: [
    ...allPostgresRepositories,
    ...allMongoRepositories,
    MongoRepositoriesService,
    PostgresRepositoriesService,
  ],
  exports: [...allPostgresRepositories, ...allMongoRepositories],
})
export class RepositoriesModule {}
