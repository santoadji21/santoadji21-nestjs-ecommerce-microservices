import { MediasController } from '@app/medias/medias.controller';
import { MediasService } from '@app/medias/medias.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MediasController],
  providers: [MediasService],
})
export class MediasModule {}
