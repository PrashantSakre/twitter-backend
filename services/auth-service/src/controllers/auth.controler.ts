import { Elysia } from "elysia";
import { loginUser, registerUser } from "../services/auth.service";

const authController = new Elysia();

authController.post("/auth/register", async ({ body, set }) => {
	try {
		const { email, password } = body as { email: string; password: string };
		const result = await registerUser(email, password);
		return result;
	} catch (e) {
		set.status = 400;
		return { error: e.message };
	}
});

authController.post("/auth/login", async ({ body, set }) => {
	try {
		const { email, password } = body as { email: string; password: string };
		const result = await loginUser(email, password);
		return result;
	} catch (e) {
		set.status = 400;
		return { error: e.message };
	}
});

export default authController;
