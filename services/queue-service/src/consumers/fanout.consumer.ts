import { redis } from "@libs/redis/client";
import axios from "axios";

export const handleFanout = async (job) => {
  const { tweetId, authorId } = job.data;
  console.log(`📣 Processing fanout for tweet ${tweetId} by ${authorId}`);

  try {
    const res = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/users/${authorId}/followers`,
    );
    const followers: { followerId: string }[] = res.data;
    console.log(`👌 followers - ${JSON.stringify(followers)}`);

    await Promise.all(
      followers.map((f) => redis.lpush(`feed:${f.followerId}`, tweetId)),
    );
    console.log(
      `✅ Tweet ${tweetId} delivered to ${followers.length} followers`,
    );
  } catch (err) {
    console.error(`❌ Fanout failed for ${tweetId}`, err);
    throw err;
  }
};
