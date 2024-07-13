import { OrdersController } from '@app/orders/orders.controller';
import { OrdersService } from '@app/orders/orders.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
