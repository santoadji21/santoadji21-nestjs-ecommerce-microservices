import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
