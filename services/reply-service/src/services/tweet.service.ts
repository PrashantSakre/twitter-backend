import { prisma } from "../config/db";

export const createReply = async (
	tweetId: string,
	authorId: string,
	content: string,
) => {
	return prisma.reply.create({
		data: { tweetId, authorId, content },
	});
};

export const getReplyById = async (replyId: string) => {
	return prisma.reply.findUnique({
		where: { id: replyId },
	});
};

export const getRepliesByTweetId = async (tweetId: string) => {
	return prisma.reply.findMany({
		where: { tweetId },
	});
};
