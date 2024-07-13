import { NotificationsService } from '@app/notifications/notifications.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getHello(): string {
    return this.notificationsService.getHello();
  }
}
