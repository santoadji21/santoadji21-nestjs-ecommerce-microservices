import { TokenPayload } from "@app/common/schemas/token.schema";
import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
	private readonly logger = new Logger(RoleGuard.name);

	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<string[]>("roles", context.getHandler());
		if (!roles || roles.length === 0) {
			// No roles specified, allow access
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user: TokenPayload = request.user;

		if (!user) {
			this.logger.error("No user found in request.");
			throw new HttpException(
				{
					statusCode: HttpStatus.UNAUTHORIZED,
					message: "User is not authenticated.",
					data: null,
					error: true,
					errors: null,
					path: request.url,
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		this.logger.debug(`User Role: ${user.user_level}`);
		this.logger.debug(`Required Roles: ${roles}`);

		if (user.user_level && roles.includes(user.user_level)) {
			return true;
		}

		this.logger.error("User does not have the required roles.");
		throw new HttpException(
			{
				statusCode: HttpStatus.FORBIDDEN,
				message: "You do not have permission to access this resource.",
				data: null,
				error: true,
				errors: null,
				path: request.url,
			},
			HttpStatus.FORBIDDEN,
		);
	}
}
