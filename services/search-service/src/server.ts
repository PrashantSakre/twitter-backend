import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { searchController } from "./controllers/tweet.controller";
import { searchWorker } from "./queues/search.worker";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "Search service is up.")
	.group("/api", (app) => app.use(searchController))
	.listen(process.env.PORT || 3002, () =>
		console.log(
			`Search service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	);

if (!searchWorker.isRunning()) {
	searchWorker.run();
}
console.log("✅ Search service is running and processing jobs");
