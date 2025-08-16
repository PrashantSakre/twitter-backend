import { redis } from "@libs/redis/client";
import { Queue } from "bullmq";

export const searchQueue = new Queue("search-index", { connection: redis });
const queueMeiliSearch = new Queue("search-sync", { connection: redis });

interface Tweet {
	id: string;
	authorId: string;
	content: string;
	createdAt: string;
}

export const publishTweetIndexJob = async (tweet: Tweet) => {
	await searchQueue.add("index-tweet", tweet, {
		removeOnComplete: true,
		removeOnFail: true,
	});
};

export async function publishTweetToSearch(tweet: Tweet) {
	await queueMeiliSearch.add("tweet-index", tweet);
}
