import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { likeContrller } from "./controlers/like.controller";

export const app = new Elysia();

app
  .use(logger())
  .use(swagger())
  .get("/", () => "like service is up.")
  .group("/api", (app) => app.use(likeContrller))
  .listen(process.env.PORT || 3005, () =>
    console.log(
      `like service listening on http://${app.server?.hostname}:${app.server?.port}`,
    ),
  );
