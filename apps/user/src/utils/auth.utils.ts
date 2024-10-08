import { user as User } from "@prisma/client";
import * as bcrypt from "bcryptjs";

export async function comparePasswords(
	plainTextPassword: string,
	hashedPassword: string,
): Promise<boolean> {
	return bcrypt.compare(plainTextPassword, hashedPassword);
}

export const excludePassword = (user: User) => {
	const { password, ...result } = user;
	return result;
};
