import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { notificationController } from "./controllers/notification.controller";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Notification service is up.")
	.group("/api", (app) => app.use(notificationController))
	.listen(process.env.PORT || 3006, () =>
		console.log(
			`Notification service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);
