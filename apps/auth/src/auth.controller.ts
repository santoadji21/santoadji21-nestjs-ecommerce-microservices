import { AuthService } from "@app/auth/auth.service";
import { CreateUserDto, CreateUserDtoSchema } from "@app/auth/dto/user.dto";
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "@app/auth/guards/local-auth.guard";
import {
	LoginUserExample,
	RegisterUserExample,
} from "@app/auth/swagger/example";
import { excludePassword } from "@app/auth/utils/auth.utils";
import { UserDto } from "@app/common/auth/jwt-auth.guard";
import { CurrentUser } from "@app/common/decorators";
import { ZodValidation } from "@app/common/decorators/zod.decorator";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { user as User } from "@prisma/client";
import { Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

ApiTags("auth");
@Controller()
export class AuthController {
	constructor(
		@InjectPinoLogger() private readonly logger: PinoLogger,
		private readonly authService: AuthService,
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
	async authenticate(@Payload() data: UserDto) {
		return data.id;
	}
}
