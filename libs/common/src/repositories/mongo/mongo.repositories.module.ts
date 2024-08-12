import { PrismaMongoModule } from "@app/common/database/mongo";
import { PrismaPostgresModule } from "@app/common/database/postgres";
import { MediaRepository } from "@app/common/repositories/mongo/media.repository";
import { NotificationRepository } from "@app/common/repositories/mongo/notification.repository";
import { Global, Module } from "@nestjs/common";

const allMongoRepositories = [NotificationRepository, MediaRepository];

@Global()
@Module({
	imports: [PrismaMongoModule, PrismaPostgresModule],
	providers: [...allMongoRepositories],
	exports: [...allMongoRepositories],
})
export class RepositoriesModule {}
