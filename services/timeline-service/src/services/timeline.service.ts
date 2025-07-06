import { redis } from "@libs/redis/client";
import axios from "axios";

const FEED_LIMIT = 100;
const TWEET_SERVICE_URL = process.env.TWEET_SERVICE_URL;

export const getTimeline = async (userId: string) => {
	const key = `feed:${userId}`;
	const tweetIds = await redis.lrange(key, 0, FEED_LIMIT - 1);
	const tweets = await Promise.all(
		tweetIds.map(async (id) => {
			try {
				const res = await axios.get(`${TWEET_SERVICE_URL}/api/tweets/${id}`);
				return res.data;
			} catch (err) {
				console.error(`⚠️ Failed to fetch tweet ${id}`, err);
				return null;
			}
		}),
	);

	// Filter out failed fetches
	return tweets.filter((t) => t !== null);
};

// export const addTweetToFollowers = async (
//   authorId: string,
//   tweetId: string,
//   followerIds: string[],
// ) => {
//   for (const followerId of followerIds) {
//     const key = `timeline:${followerId}`;
//     await redis.lpush(key, tweetId);
//     await redis.ltrim(key, 0, FEED_LIMIT - 1);
//   }
// };
