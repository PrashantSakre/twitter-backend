import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { user } from "./controllers/user.controller";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "User service is up.")
	.group("/api", (app) => app.use(user))
	.listen(process.env.PORT || 3000, () =>
		console.log(
			`User service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
