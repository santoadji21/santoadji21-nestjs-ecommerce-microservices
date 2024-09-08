import { SERVICES } from "@app/common/constants/services/services";
import { TokenPayload } from "@app/common/schemas/token.schema";
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, catchError, map, of, tap } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		@Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
	) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const jwt =
			request.cookies?.Authentication || request.headers?.authentication;

		if (!jwt) {
			return false;
		}

		return this.authClient
			.send<TokenPayload>("authenticate", {
				Authentication: jwt,
			})
			.pipe(
				tap((res) => {
					if (!res) {
						throw new UnauthorizedException("Invalid token.");
					}
					request.user = res;
				}),
				map(() => true),
				catchError((err) => {
					this.logger.error(err);
					return of(false);
				}),
			);
	}
}
