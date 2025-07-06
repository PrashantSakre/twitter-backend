import { prisma } from "../config/db";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const registerUser = async (email: string, password: string) => {
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) throw new Error("User already exists");

	const hashed = await hashPassword(password);
	const user = await prisma.user.create({ data: { email, password: hashed } });

	return { token: generateToken({ userId: user.id }) };
};

export const loginUser = async (email: string, password: string) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) throw new Error("Invalid credentials");

	const valid = await comparePassword(password, user.password);
	if (!valid) throw new Error("Invalid credentials");

	return { token: generateToken({ userId: user.id }) };
};
