import { PaymentsController } from '@app/payments/payments.controller';
import { PaymentsService } from '@app/payments/payments.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
