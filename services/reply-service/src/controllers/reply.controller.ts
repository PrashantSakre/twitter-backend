import { authPlugin } from "@libs/auth-middleware";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import {
	createReply,
	getRepliesByTweetId,
	getReplyById,
} from "../services/tweet.service";

export const replyController = new Elysia()
	.get("/tweets/:tweetId/replies", async ({ params: { tweetId }, set }) => {
		try {
			const reply = await getRepliesByTweetId(tweetId);
			if (!reply) {
				set.status = 404;
				return { error: "Replies not found" };
			}
			return reply;
		} catch (e) {
			set.status = 500;
			return { error: (e as Error).message };
		}
	})
	.get("/replies/:replyId", async ({ params: { replyId }, set }) => {
		try {
			const replies = await getReplyById(replyId);
			if (!replies) {
				set.status = 404;
				return { error: "Reply not fount" };
			}
			return replies;
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
		"/replies",
		async ({ user, body: { tweetId, content }, set }) => {
			if (!tweetId || !content) {
				set.status = 400;
				return { error: "Content is required" };
			}
			try {
				const reply = await createReply(tweetId, user.userId, content);

				return reply;
			} catch (e) {
				set.status = 500;
				return { error: (e as Error).message };
			}
		},
		{
			body: t.Object({
				tweetId: t.String(),
				content: t.String(),
			}),
		},
	);
