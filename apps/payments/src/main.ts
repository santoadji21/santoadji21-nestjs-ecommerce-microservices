import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from '@app/payments/payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  await app.listen(3000);
}
bootstrap();
