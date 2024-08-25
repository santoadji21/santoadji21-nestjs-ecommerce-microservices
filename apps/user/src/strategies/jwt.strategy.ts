import { TokenPayload } from "@app/common/schemas/token.schema";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					const authHeader = request.headers.authorization;
					if (authHeader?.startsWith("Bearer ")) {
						return authHeader.split(" ")[1];
					}
					return request?.cookies?.Authentication;
				},
			]),
			secretOrKey: configService.getOrThrow("JWT_SECRET"),
		});
	}

	async validate(payload: TokenPayload) {
		if (!payload) {
			throw new Error("Invalid token");
		}
		return payload;
	}
}
