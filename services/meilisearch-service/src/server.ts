import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { searchController } from "./controllers/tweet.controller";
import { init } from "./initMeili";
import { searchWorker } from "./queues/search.worker";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Meilisearch service is up.")
	.group("/api", (app) => app.use(searchController))
	.listen(process.env.PORT || 3010, () =>
		console.log(
			`Meilisearch service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);

if (!searchWorker.isRunning()) {
	searchWorker.run();
}
console.log("✅ Meilisearch service is running and processing jobs");
init();
