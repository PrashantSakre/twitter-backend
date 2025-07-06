import { authPlugin } from "@libs/auth-middleware";
import { Elysia } from "elysia";
import jwt from "jsonwebtoken";
import { getTimeline } from "../services/timeline.service";
// import { fanoutQueue, enq } from "@libs/queue";
// import { createTweet } from "@tweet-core";
// import { enqueueFanout } from "@libs/queue/fanout.queue";

const timelineController = new Elysia()
	.use(authPlugin)
	.derive(async ({ headers }) => {
		const authHeader = headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
		const token = authHeader.slice(7);

		// Normally, this would be handled inside `authenticate`, but this fallback ensures `user` is exposed.
		const payload = await jwt.verify(token, process.env.JWT_SECRET || "secret");

		return { user: payload };
	})
	.get("/timeline", async ({ user, set }) => {
		try {
			const feed = await getTimeline(user.userId);
			return { tweets: feed };
		} catch (e) {
			set.status = 500;
			return { error: e.message };
		}
	});

// timelineController.post("/api/tweets", async ({ body, user, set }) => {
//   try {
//     const { content } = body as { content: string };
//     const newTweet = await createTweet(user.userId, content);

//     // Enqueue fanout job to BullMQ
//     await enqueueFanout(newTweet.id, user.userId);

//     return newTweet;
//   } catch (e) {
//     set.status = 400;
//     return { error: e.message };
//   }
// });

export default timelineController;
