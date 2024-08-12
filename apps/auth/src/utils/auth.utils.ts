import { UserResponseDto } from "@app/auth/dto/user.dto";
import { user as User } from "@prisma/client";
import * as bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};

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
