import { prisma } from "../config/db";
import {
	publishTweetIndexJob,
	publishTweetToSearch,
} from "../queues/search.publisher";

export const createTweet = async (authorId: string, content: string) => {
	const tweet = await prisma.tweet.create({
		data: { authorId, content },
	});

	await publishTweetIndexJob({
		id: tweet.id,
		authorId: tweet.authorId,
		content: tweet.content,
		createdAt: tweet.createdAt.toISOString(),
	});
	await publishTweetToSearch(tweet);
	return tweet;
};

export const getTweetById = async (id: string) => {
	return prisma.tweet.findUnique({
		where: { id },
	});
};

export const getTweetsByUser = async (authorId: string) => {
	return prisma.tweet.findMany({
		where: { authorId },
		orderBy: { createdAt: "desc" },
	});
};

export const getRecentTweets = async () => {
	return prisma.tweet.findMany({
		orderBy: { createdAt: "desc" },
		take: 50,
	});
};
