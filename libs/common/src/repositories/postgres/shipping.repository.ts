import { PrismaPostgresService } from '@app/common/database/postgres';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingRepository {
  constructor(private prismaService: PrismaPostgresService) {}

  get table() {
    return this.prismaService.shipping;
  }
}
