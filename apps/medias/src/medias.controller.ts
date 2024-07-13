import { MediasService } from '@app/medias/medias.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Get()
  getHello(): string {
    return this.mediasService.getHello();
  }
}
