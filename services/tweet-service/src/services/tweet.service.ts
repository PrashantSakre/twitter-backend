import { prisma } from "../config/db";

export const createTweet = async (authorId: string, content: string) => {
	return prisma.tweet.create({
		data: { authorId, content },
	});
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
