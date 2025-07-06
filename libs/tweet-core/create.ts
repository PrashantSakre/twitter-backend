import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTweet = async (authorId: string, content: string) => {
  return prisma.tweet.create({
    data: { authorId, content },
  });
};
