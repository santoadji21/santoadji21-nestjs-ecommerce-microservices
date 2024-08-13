import { GlobalEnvModule } from "@app/common/env/env.module";
import { NotificationsController } from "@app/notifications/notifications.controller";
import { NotificationsService } from "@app/notifications/notifications.service";
import { Module } from "@nestjs/common";

@Module({
	imports: [GlobalEnvModule],
	controllers: [NotificationsController],
	providers: [NotificationsService],
})
export class NotificationsModule {}
