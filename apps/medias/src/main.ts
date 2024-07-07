import { NestFactory } from '@nestjs/core';
import { MediasModule } from './medias.module';

async function bootstrap() {
  const app = await NestFactory.create(MediasModule);
  await app.listen(3000);
}
bootstrap();
