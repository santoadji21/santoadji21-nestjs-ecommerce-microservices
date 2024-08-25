import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";

import { CurrentUser } from "@app/common/decorators";
import { TokenPayload } from "@app/common/schemas/token.schema";
import { AuthService } from "@app/user/auth/auth.service";
import { LoginUserDoc } from "@app/user/decorators/doc/login.decorator";
import { LocalAuthGuard } from "@app/user/guards/local-auth.guard";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { user as User } from "@prisma/client";
import { Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		@InjectPinoLogger() private readonly logger: PinoLogger,
	) {}

	@LoginUserDoc()
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response,
	) {
		const userWithToken = await this.authService.loginUser(user, response);
		return {
			data: userWithToken,
			message: "Login successfully",
		};
	}

	@Post("logout")
	async logout(
		@Res({ passthrough: true }) response: Response,
		@CurrentUser() user: User,
	) {
		this.logger.info("Logout user", {
			userId: user.id,
			email: user.email,
		});
		this.authService.logout(response);
		return { data: {}, message: "Logout success" };
	}

	@MessagePattern("authenticate")
	async authenticate(
		@Payload() data: { Authentication: string },
	): Promise<TokenPayload> {
		try {
			const payload = this.authService.verifyToken(data.Authentication);
			const user: TokenPayload = {
				id: payload.id,
				email: payload.email,
				user_level: payload.user_level,
			};

			if (!user) {
				throw new UnauthorizedException("Invalid token");
			}

			return user;
		} catch {
			throw new UnauthorizedException("Invalid token");
		}
	}
}
