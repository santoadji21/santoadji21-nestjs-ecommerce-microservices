import { NestFactory } from '@nestjs/core';
import { ShippingModule } from './shipping.module';

async function bootstrap() {
  const app = await NestFactory.create(ShippingModule);
  await app.listen(3000);
}
bootstrap();
