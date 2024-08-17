import { AuthService } from "@app/auth/auth.service";
import { CreateUserDto, CreateUserDtoSchema } from "@app/auth/dto/user.dto";
import ForgotPassword from "@app/auth/email/forgot-password";
import { AuthEnvService } from "@app/auth/env/env.service";
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "@app/auth/guards/local-auth.guard";
import {
	LoginUserExample,
	RegisterUserExample,
} from "@app/auth/swagger/example";
import { excludePassword } from "@app/auth/utils/auth.utils";
import { CurrentUser } from "@app/common/decorators";
import { ZodValidation } from "@app/common/decorators/zod.decorator";
import { EmailService } from "@app/common/email/email.service";
import { TokenPayload } from "@app/common/schemas/token.schema";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	Query,
	Res,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { user as User } from "@prisma/client";
import { Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

ApiTags("auth");
@Controller()
export class AuthController {
	constructor(
		@InjectPinoLogger() private readonly logger: PinoLogger,
		private readonly authService: AuthService,
		private readonly emailService: EmailService,
		private readonly authEnv: AuthEnvService,
	) {}

	@ApiOperation({
		summary: "Register user",
		description: "Register new user",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "The record has been successfully created.",
		schema: {
			example: RegisterUserExample,
		},
	})
	@HttpCode(HttpStatus.OK)
	@Post("register")
	@ZodValidation(CreateUserDtoSchema)
	async register(@Body() createUserDto: CreateUserDto) {
		this.logger.info("Creating a new user");
		this.logger.info(JSON.stringify(createUserDto));
		const user = await this.authService.register(createUserDto);
		return {
			data: excludePassword(user as User),
			message: "Register new user",
		};
	}

	@ApiOperation({
		summary: "Login user",
		description: "Login user",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "The login has been successfully.",
		schema: {
			example: LoginUserExample,
		},
	})
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

	@Get("profile")
	@UseGuards(JwtAuthGuard)
	async getProfile(@CurrentUser() user: User) {
		this.logger.info("Get user profile");
		this.logger.info(`Email: ${user.email}`);
		if (!user.id) {
			throw new NotFoundException("User not found");
		}
		const userProfile = await this.authService.profile(user.id);
		if (!userProfile) {
			throw new NotFoundException("User not found");
		}
		return {
			data: excludePassword(userProfile),
			message: "Get user profile successfully",
		};
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

	@UseGuards(JwtAuthGuard)
	@Get("nats")
	async testNats(@CurrentUser() user: User) {
		return this.authService.userNotification(user);
	}

	@ApiOperation({
		summary: "Send forgot password",
		description: "Send forgot password via email",
	})
	@ApiParam({ name: "email" })
	@HttpCode(HttpStatus.OK)
	@Get("forgot-password")
	async SendForgotPasswordEmail(@Query("email") email) {
		const data = await this.authService.sendForgotPasswordEmail(email);
		const user = await this.authService.getUserByEmail(email);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		this.emailService.sendMail({
			email: email,
			template: ForgotPassword({
				user: `${user?.name}`,
				url: `${this.authEnv.get("FRONTEND_URL")}/reset-password/${data.token}`,
			}),
			subject: "Reset password",
			source: `${this.authEnv.get("SES_EMAIL_SOURCE")}`,
		});

		return {
			data,
			message: "Send forgot password successfully",
		};
	}
}
