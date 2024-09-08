import { EVENTS } from "@app/common/constants/events/events";
import { NotificationsService } from "@app/notifications/notifications.service";
import { Controller, Get } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

@Controller()
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Get()
	getHello(): string {
		return this.notificationsService.getHello();
	}

	@EventPattern(EVENTS.EMAIL.USER_NOTIFICATION)
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async userNotification(data: any) {
		console.log("TEST USER NATS ", data);
	}
}
