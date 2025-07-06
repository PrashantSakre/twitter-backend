import { authPlugin } from "@libs/auth-middleware";
import axios from "axios";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import {
	createOrUpdateUserProfile,
	followUser,
	getFollowers,
	getFollowing,
	getUserById,
	unfollowUser,
} from "../services/user.service";

const authUserController = new Elysia({ prefix: "/users" })
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
		"/follow",
		async ({
			body: { userId: followingId },
			user: { userId: followerId },
			set,
		}) => {
			try {
				console.log(followerId, followingId);
				await followUser(followerId, followingId);
				await axios.post(
					`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
					{
						userId: followingId,
						type: "follow",
						data: {
							followedBy: followerId,
						},
					},
					{
						headers: {
							"x-api-key": process.env.INTERNAL_API_KEY,
						},
					},
				);
				return { message: "Folowed" };
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			body: t.Object({
				userId: t.String(),
			}),
		},
	)
	.delete(
		"/unfollow",
		async ({
			body: { userId: followingId },
			user: { userId: followerId },
			set,
		}) => {
			try {
				await unfollowUser(followerId, followingId);
				return { message: "Unfollowed" };
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			body: t.Object({
				userId: t.String(),
			}),
		},
	)
	.post(
		"/me",
		async ({ user, body, set }) => {
			if (!body) {
				set.status = 400;
				return { error: "Invalid Data." };
			}

			const { name, bio, avatarUrl } = body;

			try {
				const profile = await createOrUpdateUserProfile(user.userId, {
					name,
					bio,
					avatarUrl,
				});
				return profile;
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			body: t.Object({
				name: t.Optional(t.String()),
				bio: t.Optional(t.String()),
				avatarUrl: t.Optional(t.String()),
			}),
		},
	);

const userController = new Elysia({ prefix: "/users/:userId" })
	.get(
		"/followers",
		async ({ params: { userId }, set }) => {
			try {
				return await getFollowers(userId);
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			params: t.Object({
				userId: t.String(),
			}),
		},
	)
	.get(
		"/following",
		async ({ params: { userId }, set }) => {
			try {
				return await getFollowing(userId);
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			params: t.Object({
				userId: t.String(),
			}),
		},
	)
	.get(
		"",
		async ({ params: { userId }, set }) => {
			try {
				const user = await getUserById(userId);
				if (!user) {
					set.status = 404;
					return { message: "User no found." };
				}
				return user;
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			params: t.Object({
				userId: t.String(),
			}),
		},
	);

export const user = new Elysia().use(authUserController).use(userController);
