import { PrismaMongoService } from '@app/common/database/mongo';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaMongoService],
  exports: [PrismaMongoService],
})
export class PrismaMongoModule {}
