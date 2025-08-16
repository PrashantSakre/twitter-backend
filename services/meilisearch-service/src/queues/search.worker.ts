import { redis } from "@libs/redis/client";
import { Worker } from "bullmq";
import { tweetIndex, userIndex } from "../lib/meili";

const handleSearchIndex = async (job) => {
	if (job.name === "tweet-index") {
		await tweetIndex.addDocuments([job.data]);
	} else if (job.name === "user-index") {
		await userIndex.addDocuments([job.data]);
	}
};

export const searchWorker = new Worker("search-sync", handleSearchIndex, {
	connection: redis,
});

searchWorker.on("completed", (job) => {
	console.log(`✅ Job ${job.id} (${job.name}) completed`);
});

searchWorker.on("failed", (job, err) => {
	console.error(`❌ Job ${job?.id} (${job?.name}) failed:`, err);
});
