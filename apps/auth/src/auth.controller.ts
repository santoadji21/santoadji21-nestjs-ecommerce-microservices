import { AuthService } from "@app/auth/auth.service";
import { LoginUserDoc } from "@app/auth/decorators/doc/login.decorator";
import { RegisterUserDoc } from "@app/auth/decorators/doc/register.decorator";
import { ResetPasswordDoc } from "@app/auth/decorators/doc/reset-password.decorator";
import {
	CreateUserDto,
	CreateUserDtoSchema,
	UpdatePasswordDto,
} from "@app/auth/dto/user.dto";
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "@app/auth/guards/local-auth.guard";
import { excludePassword } from "@app/auth/utils/auth.utils";
import { RoleGuard } from "@app/common/auth/role-auth.guard";
import { CurrentUser, Roles } from "@app/common/decorators";
import { ZodValidation } from "@app/common/decorators/zod.decorator";
import { TokenPayload } from "@app/common/schemas/token.schema";
import {
	Body,
	Controller,
	Delete,
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
import { ApiTags } from "@nestjs/swagger";
import { USER_LEVEL, user as User } from "@prisma/client";
import { Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

ApiTags("auth");
@Controller()
export class AuthController {
	constructor(
		@InjectPinoLogger() private readonly logger: PinoLogger,
		private readonly authService: AuthService,
	) {}

	@RegisterUserDoc()
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

	@Get("users")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async allUsers() {
		const users = await this.authService.allUsers();
		this.logger.info("Get all users");
		const usersWithoutPassword = users.map((user) => {
			return excludePassword(user);
		});

		return {
			data: usersWithoutPassword,
			message: "Get all users successfully",
		};
	}
	@Delete("users")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async deleteUser(@Body() { id }: { id: string | string[] }) {
		const deleteUser = await this.authService.deleteUser(id);

		return {
			data: {},
			message: `Delete ${deleteUser} user successfully`,
		};
	}

	@Post("assign-to-admin")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async assignToAdmin(@Body() { id }: { id: string | string[] }) {
		return await this.authService.assignToAdmin(id);
	}

	@Post("remove-from-admin")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async removeFromAdmin(@Body() { id }: { id: string | string[] }) {
		return await this.authService.removeFromAdmin(id);
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

	@HttpCode(HttpStatus.OK)
	@Get("reset-password")
	async sendResetPasswordEmail(@Query("email") email) {
		const data = await this.authService.sendResetPasswordEmail(email);
		return {
			data,
			message: "Send reset password successfully",
		};
	}

	@ResetPasswordDoc()
	@Post("reset-password")
	async resetPassword(@Body() data: UpdatePasswordDto) {
		const result = await this.authService.resetPassword(data);
		return {
			data: excludePassword(result),
			message: "Reset password successfully",
		};
	}
}
