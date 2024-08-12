import { CreateUserDto, UserLoginDto } from "@app/auth/dto/user.dto";
import { EnvService } from "@app/auth/env/env.service";
import { TokenPayload } from "@app/auth/schema/token.schema";
import { comparePasswords, excludePassword } from "@app/auth/utils/auth.utils";
import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { user as User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { Response } from "express";

@Injectable()
export class AuthService {
	constructor(
		private readonly repos: PostgresRepositoriesService,
		private jwtService: JwtService,
		private readonly envService: EnvService,
	) {}
	//Register new User
	async register(data: CreateUserDto) {
		const saltOrRounds = 10;
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

	//Login User
	async login(data: UserLoginDto) {
		const checkUser = await this.repos.userRepository.getUserByEmail(
			data.email,
		);
		if (!checkUser) {
			throw new BadRequestException("User email not found");
		}
		const isMatch = await bcrypt.compare(data.password, checkUser.password);
		if (!isMatch) {
			throw new BadRequestException("User password not match");
		}
		const payload = {
			id: checkUser.id,
			name: checkUser.name,
			email: checkUser.email,
			userLevel: checkUser.user_level,
		};
		const accessToken = await this.jwtService.signAsync(payload);
		return { accessToken };
	}

	async loginUser(user: User, response: Response) {
		const tokenPayload: TokenPayload = {
			id: user.id,
			email: user.email,
		};

		const expires = new Date();
		const expiresDate = this.envService.get("JWT_EXPIRATION_TIME");

		expires.setSeconds(expires.getSeconds() + Number(expiresDate));

		const token = this.jwtService.sign(tokenPayload);

		response.cookie("Authentication", token, {
			httpOnly: true,
			expires,
		});

		return {
			user: {
				id: user.id,
				email: user.email,
				user_level: user.user_level,
			},
			token,
		};
	}

	// Get user profile
	async profile(id: string) {
		return await this.repos.userRepository.getUserById(id);
	}

	// Send email
	async sendForgotPasswordEmail(email: string) {
		const checkUser = await this.repos.userRepository.getUserByEmail(email);
		if (!checkUser) {
			throw new BadRequestException("User email not found");
		}

		const expired_at = dayjs().add(1, "day").toDate();

		const token = await this.jwtService.signAsync({
			email: email,
		});
		const checkForgotPassword =
			await this.repos.forgotPassword.findByEmail(email);

		if (checkForgotPassword) {
			return await this.repos.forgotPassword.update(checkForgotPassword.id, {
				token: token,
				expired_at: expired_at,
			});
		}

		return await this.repos.forgotPassword.create({
			email: email,
			token: token,
			expired_at: expired_at,
		});
	}

	async validateUser(email: string, password: string): Promise<unknown> {
		const user = await this.repos.userRepository.getUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException("Email does not exist");
		}

		const isPasswordValid = await comparePasswords(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException("Invalid password");
		}

		return excludePassword(user);
	}

	verifyToken(token: string): Promise<unknown> {
		return this.jwtService.verify(token);
	}
}
