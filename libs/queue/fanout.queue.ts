import { Queue } from "bullmq";
import { redis } from "../redis/client";

export const fanoutQueue = new Queue("fanout", {
  connection: redis,
});

export const enqueueFanout = async (tweetId: string, authorId: string) => {
  await fanoutQueue.add("fanout-job", { tweetId, authorId });
};
