import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import timelineController from "./controllers/timeline.controller";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Timeline service is up.")
	.group("/api", (app) => app.use(timelineController))
	.listen(process.env.PORT || 3004, () =>
		console.log(
			`Timeline service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
