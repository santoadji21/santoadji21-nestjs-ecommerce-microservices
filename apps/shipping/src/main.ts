import 'tsconfig-paths/register';
import { ShippingModule } from '@app/shipping/shipping.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(ShippingModule);
  await app.listen(3000);
}
bootstrap();
