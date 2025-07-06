import { Worker } from "bullmq";
import { handleFanout } from "services/queue-service/src/consumers/fanout.consumer";
import { redis } from "../redis/client";

export const fanoutWorker = new Worker("fanout", handleFanout, {
  connection: redis,
  // concurrency: 5,
  // removeOnComplete: true,
  // removeOnFail: true,
});

fanoutWorker.on("completed", (job) => {
  console.log(`🎉 Job completed for tweetId: ${job.data.tweetId}`);
});

fanoutWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed for tweetId: ${job?.data?.tweetId}`, err);
});
