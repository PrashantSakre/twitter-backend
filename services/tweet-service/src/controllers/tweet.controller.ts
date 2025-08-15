import { authPlugin } from "@libs/auth-middleware";
import { enqueueFanout } from "@libs/queue/fanout.queue";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import {
	createTweet,
	getTweetById,
	getTweetsByUser,
} from "../services/tweet.service";

export const tweetController = new Elysia()
	.get("/tweets/:id", async ({ params: { id }, set }) => {
		try {
			const tweet = await getTweetById(id);
			if (!tweet) {
				set.status = 404;
				return { error: "Tweet not found" };
			}
			return tweet;
		} catch (e) {
			set.status = 500;
			return { error: (e as Error).message };
		}
	})
	.get("/users/:userId/tweets", async ({ params: { userId }, set }) => {
		try {
			return await getTweetsByUser(userId);
		} catch (e) {
			set.status = 500;
			return { error: (e as Error).message };
		}
	})
	.use(authPlugin)
	.derive(async ({ headers }) => {
		const authHeader = headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
		const token = authHeader.slice(7);

		// Normally, this would be handled inside `authenticate`, but this fallback ensures `user` is exposed.
		const payload = await jwt.verify(token, process.env.JWT_SECRET || "secret");

		return { user: payload };
	})
	.post(
		"/tweets",
		async ({ user, body: { content }, set }) => {
			if (!content) {
				set.status = 400;
				return { error: "Content is required" };
			}
			try {
				const tweet = await createTweet(user.userId, content);

				// Enqueue Fanout job
				await enqueueFanout(tweet.id, tweet.authorId); // or tweet.authorId === user.userId

				return tweet;
			} catch (e) {
				set.status = 500;
				return { error: (e as Error).message };
			}
		},
		{
			body: t.Object({
				content: t.String(),
			}),
		},
	);
