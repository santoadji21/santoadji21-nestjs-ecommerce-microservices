import { PostgresRepositoriesService } from "@app/common/repositories/postgres/postgres.repositories.service";
import { TokenPayload } from "@app/common/schemas/token.schema";
import { UserLoginDto } from "@app/user/dto/user.dto";
import { UserEnvService } from "@app/user/env/env.service";
import { comparePasswords, excludePassword } from "@app/user/utils/auth.utils";
import {
	BadRequestException,
	Injectable,
	Res,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { user as User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Response } from "express";

@Injectable()
export class AuthService {
	constructor(
		private readonly repos: PostgresRepositoriesService,
		private jwtService: JwtService,
		private readonly userEnv: UserEnvService,
	) {}

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
			user_level: user.user_level,
		};

		const expires = new Date();
		const expiresDate = this.userEnv.get("JWT_EXPIRATION_TIME");

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

	// Logout
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie("Authentication");
		return { data: {}, message: "Logout success" };
	}

	verifyToken(token: string) {
		return this.jwtService.verify(token);
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
}
