import { SetMetadata } from "@nestjs/common";
import { USER_LEVEL } from "@prisma/client";

export const ROLES_KEY = "roles";
export const Roles = (...roles: USER_LEVEL[]) => SetMetadata(ROLES_KEY, roles);
