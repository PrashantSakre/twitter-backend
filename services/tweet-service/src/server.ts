import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { tweetController } from "./controllers/tweet.controller";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Tweet service is up.")
	.group("/api", (app) => app.use(tweetController))
	.listen(process.env.PORT || 3002, () =>
		console.log(
			`Tweet service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
