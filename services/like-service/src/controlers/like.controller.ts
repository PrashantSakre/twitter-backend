import Elysia from "elysia";
import { authPlugin } from "libs/auth-middleware/src";
import { redis } from "@libs/redis/client";
import jwt from "jsonwebtoken";
import axios from "axios";

export const likeContrller = new Elysia()
  .use(authPlugin)
  .derive(async ({ headers }) => {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
    const token = authHeader.slice(7);

    // Normally, this would be handled inside `authenticate`, but this fallback ensures `user` is exposed.
    const payload = await jwt.verify(token, process.env.JWT_SECRET || "secret");

    return { user: payload };
  })
  // Like a tweet
  .post("/likes/tweets/:id", async ({ params: { id }, user, set }) => {
    try {
      await redis.sadd(`tweet:${id}:likes`, user.userId);

      // Get tweet info to know the author
      const tweetRes = await axios.get(
        `${process.env.TWEET_SERVICE_URL}/api/tweets/${id}`,
      );
      const authorId = tweetRes.data.authorId;

      // Push notification to the author
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
        {
          userId: authorId,
          type: "like",
          data: {
            likedBy: user.userId,
            tweetId: id,
          },
        },
        {
          headers: {
            "x-api-key": process.env.INTERNAL_API_KEY,
          },
        },
      );

      return { message: "Liked" };
    } catch (e) {
      set.status = 500;
      return { error: (e as Error).message };
    }
  })
  // Unlike a tweet
  .delete("/likes/tweets/:id", async ({ params: { id }, user, set }) => {
    try {
      await redis.srem(`tweet:${id}:likes`, user.userId);
      return { message: "Unliked" };
    } catch (e) {
      set.status = 500;
      return { error: (e as Error).message };
    }
  })
  // Get like count
  .get("/likes/tweets/:id", async ({ params: { id }, set }) => {
    try {
      const count = await redis.scard(`tweet:${id}:likes`);
      return { count };
    } catch (e) {
      set.status = 500;
      return { error: (e as Error).message };
    }
  });
