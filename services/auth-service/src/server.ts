import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import authController from "./controllers/auth.controler";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Auth service is up.")
	.group("/api", (app) => app.use(authController))
	.listen(process.env.PORT || 3001, () =>
		console.log(
			`Auth service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
