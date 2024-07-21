import { PrismaPostgresService } from '@app/common/database/postgres';
import { Injectable } from '@nestjs/common';
import { Prisma, USER_LEVEL } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaPostgresService) {}

  get table() {
    return this.prismaService.user;
  }

  async getAllUsers() {
    return await this.table.findMany();
  }

  async getUserByEmail(email: string) {
    return await this.table.findFirst({
      where: {
        email: email,
      },
    });
  }

  async getUserById(id: string) {
    return await this.table.findFirst({
      where: {
        id: id,
      },
    });
  }

  async getUserByUserLevel(level: USER_LEVEL) {
    return await this.table.findMany({
      where: {
        user_level: level,
      },
    });
  }

  async getUserByCustom(where: Prisma.userWhereInput) {
    return await this.table.findMany({
      where: where,
    });
  }
}
