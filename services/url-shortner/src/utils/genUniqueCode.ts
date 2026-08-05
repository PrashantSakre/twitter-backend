import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	7,
);

export const code = nanoid;
