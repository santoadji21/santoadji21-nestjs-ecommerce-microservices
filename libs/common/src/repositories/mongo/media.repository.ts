import { PrismaMongoService } from '@app/common/database/mongo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaRepository {
  constructor(private prismaMongoService: PrismaMongoService) {}

  get table() {
    return this.prismaMongoService.media;
  }
}
