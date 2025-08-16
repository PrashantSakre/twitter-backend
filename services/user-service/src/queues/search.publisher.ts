import { redis } from "@libs/redis/client";
import { Queue } from "bullmq";

export const searchQueue = new Queue("search-index", { connection: redis });
const queueMeiliSearch = new Queue("search-sync", { connection: redis });

interface User {
	id: string;
	name: string;
	bio: string;
	avatarUrl: string;
}

export const publishUserIndexJob = async (user: User) => {
	await searchQueue.add("index-user", user, {
		removeOnComplete: true,
		removeOnFail: true,
	});
};

export async function publishUserToSearch(user: User) {
	await queueMeiliSearch.add("user-index", user);
}
