import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { replyController } from "./controllers/reply.controller";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Reply service is up.")
	.group("/api", (app) => app.use(replyController))
	.listen(process.env.PORT || 3007, () =>
		console.log(
			`Reply service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
