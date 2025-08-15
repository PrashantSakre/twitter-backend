import { redis } from "@libs/redis/client";
import { Queue } from "bullmq";

export const searchQueue = new Queue("search-index", { connection: redis });

export const publishUserIndexJob = async (user: {
	id: string;
	name: string;
	bio: string;
	avatarUrl: string;
}) => {
	await searchQueue.add("index-user", user, {
		removeOnComplete: true,
		removeOnFail: true,
	});
};
