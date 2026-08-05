import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { cassandraClient } from "./config/cassandra";
import { prisma } from "./config/prisma";
import { redirectController } from "./controllers/redirect.controller";
import { url } from "./controllers/url.controller";

export const app = new Elysia();

app
	.use(staticPlugin())
	.use(logger())
	.use(swagger())
	.get("/", () => "URL Shortner service is up.")
	.group("/api", (app) => app.use(url))
	.group("", (app) => app.use(redirectController))
	.listen(process.env.PORT || 3000, () =>
		console.log(
			`URL Shortner service listening on http://${app.server?.hostname}:${app.server?.port}`,
		),
	)
	.onStop(async () => {
		// Disconnect from Databases
		await prisma.$disconnect();
		await cassandraClient.shutdown();
	});

async function gracefulShutdown() {
	try {
		console.log("Shutting down server...");
		await app.stop();

		// Disconnect from Databases
		await prisma.$disconnect();
		await cassandraClient.shutdown();
		console.log("Database disconnected.");

		process.exit(0);
	} catch (e) {
		console.log({ error: (e as Error).message });
		process.exit(1);
	}
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
