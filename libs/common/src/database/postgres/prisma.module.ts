import { PrismaService } from '@app/common/database/postgres';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
