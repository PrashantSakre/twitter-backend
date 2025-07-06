import { authPlugin } from "@libs/auth-middleware";
import { redis } from "@libs/redis/client";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";

export const notificationController1 = new Elysia()
	.use(authPlugin)
	.derive(async ({ headers }) => {
		const authHeader = headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
		const token = authHeader.slice(7);

		// Normally, this would be handled inside `authenticate`, but this fallback ensures `user` is exposed.
		const payload = await jwt.verify(token, process.env.JWT_SECRET || "secret");

		return { user: payload };
	})
	// Fetch current user's notifications
	.get("/notifications", async ({ user }) => {
		const items = await redis.lrange(`notifications:${user.userId}`, 0, 49);
		return items.map((item) => JSON.parse(item));
	});

export const notificationController2 = new Elysia()
	// Add a notification (used by other services)
	.post(
		"/notifications",
		async ({ headers, body: { userId, type, data }, set }) => {
			const apiKey = headers["x-api-key"];
			if (apiKey !== process.env.INTERNAL_API_KEY) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			if (!userId || !type) {
				set.status = 400;
				return { error: "Missing userId or type" };
			}

			const notification = {
				id: crypto.randomUUID(),
				type,
				data,
				createdAt: Date.now(),
			};

			await redis.lpush(
				`notifications:${userId}`,
				JSON.stringify(notification),
			);

			return { message: "Notification sent" };
		},
		{
			body: t.Object({
				userId: t.String(),
				type: t.String(),
				data: t.Optional(t.Any()),
			}),
		},
	);

export const notificationController = new Elysia()
	.use(notificationController1)
	.use(notificationController2);
