import { redis } from "@libs/redis/client";
import { PrismaClient } from "@prisma/client";
import { Worker } from "bullmq";

const prisma = new PrismaClient();

const handleSearchIndex = async (job) => {
	if (job.name === "index-tweet") {
		const { id, authorId, content, createdAt } = job.data;
		await prisma.tweets.upsert({
			where: { id },
			create: {
				id,
				author_id: authorId,
				content,
				created_at: new Date(createdAt),
			},
			update: { content },
		});
	}

	if (job.name === "index-user") {
		const { id, bio, name, avatarUrl } = job.data;
		await prisma.users.upsert({
			where: { id },
			create: { id, bio, name, avatar_url: avatarUrl },
			update: { bio, name, avatar_url: avatarUrl },
		});
	}
};

export const searchWorker = new Worker("search-index", handleSearchIndex, {
	connection: redis,
});

searchWorker.on("completed", (job) => {
	console.log(`✅ Job ${job.id} (${job.name}) completed`);
});

searchWorker.on("failed", (job, err) => {
	console.error(`❌ Job ${job?.id} (${job?.name}) failed:`, err);
});
