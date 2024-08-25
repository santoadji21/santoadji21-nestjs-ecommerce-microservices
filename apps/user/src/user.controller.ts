import { RoleGuard } from "@app/common/auth/role-auth.guard";
import { CurrentUser, Roles } from "@app/common/decorators";
import { ZodValidation } from "@app/common/decorators/zod.decorator";
import { RegisterUserDoc } from "@app/user/decorators/doc/register.decorator";
import { ResetPasswordDoc } from "@app/user/decorators/doc/reset-password.decorator";
import {
	CreateUserDto,
	CreateUserDtoSchema,
	UpdatePasswordDto,
	UpdateUserDto,
} from "@app/user/dto/user.dto";
import { JwtAuthGuard } from "@app/user/guards/jwt-auth.guard";
import { UserService } from "@app/user/user.service";
import { excludePassword } from "@app/user/utils/auth.utils";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { USER_LEVEL, user as User } from "@prisma/client";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

ApiTags("user");
@Controller()
export class UserController {
	constructor(
		@InjectPinoLogger() private readonly logger: PinoLogger,
		private readonly userService: UserService,
	) {}

	@RegisterUserDoc()
	@HttpCode(HttpStatus.OK)
	@Post("register")
	@ZodValidation(CreateUserDtoSchema)
	async register(@Body() createUserDto: CreateUserDto) {
		this.logger.info("Creating a new user");
		this.logger.info(JSON.stringify(createUserDto));
		const user = await this.userService.register(createUserDto);
		return {
			data: excludePassword(user as User),
			message: "Register new user",
		};
	}

	@Get("all")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async allUsers() {
		const users = await this.userService.allUsers();
		this.logger.info("Get all users");
		const usersWithoutPassword = users.map((user) => {
			return excludePassword(user);
		});

		return {
			data: usersWithoutPassword,
			message: "Get all users successfully",
		};
	}

	@Patch("update")
	@UseGuards(JwtAuthGuard)
	async updateUser(@Body() data: UpdateUserDto) {
		return await this.userService.updateUser(data.id, data);
	}

	@Delete("delete")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async deleteUser(@Body() { id }: { id: string | string[] }) {
		const deleteUser = await this.userService.deleteUser(id);

		return {
			data: {},
			message: `Delete ${deleteUser} user successfully`,
		};
	}

	@Post("assign-to-admin")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async assignToAdmin(@Body() { id }: { id: string | string[] }) {
		return await this.userService.assignToAdmin(id);
	}

	@Post("remove-from-admin")
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(USER_LEVEL.ADMIN)
	async removeFromAdmin(@Body() { id }: { id: string | string[] }) {
		return await this.userService.removeFromAdmin(id);
	}

	@Get("profile")
	@UseGuards(JwtAuthGuard)
	async getProfile(@CurrentUser() user: User) {
		this.logger.info("Get user profile");
		this.logger.info(`Email: ${user.email}`);
		if (!user.id) {
			throw new NotFoundException("User not found");
		}
		const userProfile = await this.userService.profile(user.id);
		if (!userProfile) {
			throw new NotFoundException("User not found");
		}
		return {
			data: excludePassword(userProfile),
			message: "Get user profile successfully",
		};
	}

	@UseGuards(JwtAuthGuard)
	@Get("nats")
	async testNats(@CurrentUser() user: User) {
		return this.userService.userNotification(user);
	}

	@HttpCode(HttpStatus.OK)
	@Get("reset-password")
	async sendResetPasswordEmail(@Query("email") email) {
		const data = await this.userService.sendResetPasswordEmail(email);
		return {
			data,
			message: "Send reset password successfully",
		};
	}

	@ResetPasswordDoc()
	@Post("reset-password")
	async resetPassword(@Body() data: UpdatePasswordDto) {
		const result = await this.userService.resetPassword(data);
		return {
			data: excludePassword(result),
			message: "Reset password successfully",
		};
	}
}
