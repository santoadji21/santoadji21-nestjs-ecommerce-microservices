import { PaymentsService } from '@app/payments/payments.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
}
