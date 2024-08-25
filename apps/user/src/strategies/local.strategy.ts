import { AuthService } from "@app/user/auth/auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: "email",
			passwordField: "password",
		});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async validate(username: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException("Invalid email or password");
		}
		return user;
	}
}
