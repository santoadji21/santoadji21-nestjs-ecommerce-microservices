import { CreateUserDto, UpdatePasswordDto } from "@app/user/dto/user.dto";
import ForgotPassword from "@app/user/email/forgot-password";
import SuccessResetPassword from "@app/user/email/success-reset-password";

import { EVENTS } from "@app/common/constants/events/events";
import { NOTIFICATION_SERVICE } from "@app/common/constants/services/services";
import { EmailService } from "@app/common/email/email.service";
import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import { excludePassword } from "@app/user/utils/auth.utils";
import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { user as User } from "@prisma/client";
import { UserEnvService } from "apps/user/src/env/env.service";
import * as bcrypt from "bcryptjs";
import * as dayjs from "dayjs";

import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Injectable()
export class UserService {
	constructor(
		private readonly repos: PostgresRepositoriesService,
		private jwtService: JwtService,
		private readonly emailService: EmailService,
		private readonly userEnv: UserEnvService,
		@Inject(NOTIFICATION_SERVICE)
		private readonly notificationClient: ClientProxy,
		@InjectPinoLogger() private readonly logger: PinoLogger,
	) {}
	//Register new User
	async register(data: CreateUserDto) {
		const saltOrRounds = this.userEnv.get("SALT_ROUNDS");
		const hashPassword = await bcrypt.hash(data.password, saltOrRounds);
		data.password = hashPassword;
		const checkUser = await this.repos.userRepository.getUserByEmail(
			data.email,
		);
		if (checkUser) {
			throw new BadRequestException("User already exists");
		}
		try {
			const createUser = await this.repos.userRepository.createUser(data);
			if (createUser) {
				return createUser;
			}
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	// Get all users
	async allUsers() {
		return await this.repos.userRepository.getAllUsers();
	}

	// Get user profile
	async profile(id: string) {
		return await this.repos.userRepository.getUserById(id);
	}

	// Get user by email
	async getUserByEmail(email: string) {
		return await this.repos.userRepository.getUserByEmail(email);
	}

	// Delete user
	async deleteUser(id: string | string[]) {
		return await this.repos.userRepository.deleteUser(id);
	}

	// Send reset password
	async sendResetPasswordEmail(email: string) {
		const expiredAt = dayjs().add(1, "day").toDate();

		const token = await this.jwtService.signAsync({ email });

		const existingForgotPasswordRecord =
			await this.repos.forgotPassword.findByEmail(email);

		const user = await this.repos.userRepository.getUserByEmail(email);
		if (!user) throw new NotFoundException("User not found");

		// Log and send the reset password email
		this.logger.info("Send reset password token to user email");
		await this.emailService.sendMail({
			email,
			template: ForgotPassword({
				user: user.name,
				url: `${this.userEnv.get("FRONTEND_URL")}/reset-password/${token}`,
			}),
			subject: "Reset password",
			source: `${this.userEnv.get("SES_EMAIL_SOURCE")}`,
		});

		if (existingForgotPasswordRecord) {
			return await this.repos.forgotPassword.update(
				existingForgotPasswordRecord.id,
				{
					token,
					expired_at: expiredAt,
				},
			);
		}

		return await this.repos.forgotPassword.create({
			email,
			token,
			expired_at: expiredAt,
		});
	}

	//Check token expired
	async checkTokenExpired(forgotPasswordToken: string) {
		const checkToken =
			await this.repos.forgotPassword.findByToken(forgotPasswordToken);

		if (!checkToken) throw new BadRequestException("Token not found");

		if (
			!checkToken.expired_at ||
			checkToken.expired_at.getTime() < dayjs().toDate().getTime()
		) {
			throw new BadRequestException("Token is expired");
		}

		const user = await this.repos.userRepository.getUserByEmail(
			checkToken.email,
		);

		if (!user) throw new BadRequestException("User not found");

		const userWithoutPassword = excludePassword(user);

		return {
			...userWithoutPassword,
			token: checkToken.token,
		};
	}

	async resetPassword(data: UpdatePasswordDto) {
		const forgotPasswordRecord = await this.repos.forgotPassword.findByToken(
			data.token,
		);

		if (!forgotPasswordRecord) throw new BadRequestException("Token not found");

		if (
			!forgotPasswordRecord.expired_at ||
			forgotPasswordRecord.expired_at.getTime() < dayjs().toDate().getTime()
		) {
			throw new BadRequestException("Token is expired");
		}

		const user = await this.repos.userRepository.getUserByEmail(
			forgotPasswordRecord.email,
		);
		if (!user) throw new BadRequestException("User not found");

		const saltOrRounds = this.userEnv.get("SALT_ROUNDS");
		const hashPassword = await bcrypt.hash(data.password, saltOrRounds);

		const updatePassword = await this.repos.userRepository.updateUser(user.id, {
			password: hashPassword,
		});

		if (updatePassword) {
			this.logger.info("Notify user success reset password");
			await this.emailService.sendMail({
				email: user.email,
				template: SuccessResetPassword({
					url: `${this.userEnv.get("FRONTEND_URL")}/login`,
				}),
				subject: "Success reset password",
				source: `${this.userEnv.get("SES_EMAIL_SOURCE")}`,
			});
			return updatePassword;
		}
		throw new InternalServerErrorException("Failed to reset password");
	}
	// Assign to admin
	async assignToAdmin(id: string | string[]) {
		const userWithAdmin = await this.repos.userRepository.assignToAdmin(id);
		return {
			data: excludePassword(userWithAdmin as User),
			message: "User assigned to admin",
		};
	}

	// Remove from admin
	async removeFromAdmin(id: string | string[]) {
		const userWithAdmin = await this.repos.userRepository.removeFromAdmin(id);
		return {
			data: excludePassword(userWithAdmin as User),
			message: "User removed from admin",
		};
	}

	userNotification(user: User) {
		this.notificationClient.emit(EVENTS.USER_NOTIFICATION, user);
		return { data: user, message: "User notification sent" };
	}
}
