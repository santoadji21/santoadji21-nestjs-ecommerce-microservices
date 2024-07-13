import { OrdersService } from '@app/orders/orders.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getHello(): string {
    return this.ordersService.getHello();
  }
}
