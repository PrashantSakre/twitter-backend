import { prisma } from "../config/db";

export const getUserById = async (id: string) => {
	return prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			bio: true,
			avatarUrl: true,
			createdAt: true,
		},
	});
};

export const followUser = async (followerId: string, followingId: string) => {
	if (followerId === followingId) throw new Error("Cannot follow yourself");

	return prisma.follow.create({
		data: {
			followerId,
			followingId,
		},
	});
};

export const unfollowUser = async (followerId: string, followingId: string) => {
	return prisma.follow.delete({
		where: {
			followerId_followingId: {
				followerId,
				followingId,
			},
		},
	});
};

export const getFollowers = async (userId: string) => {
	return prisma.follow.findMany({
		where: { followingId: userId },
		include: { follower: true },
	});
};

export const getFollowing = async (userId: string) => {
	return prisma.follow.findMany({
		where: { followerId: userId },
		include: { following: true },
	});
};

export const createOrUpdateUserProfile = async (
	userId: string,
	data: { name?: string; bio?: string; avatarUrl?: string },
) => {
	return prisma.user.upsert({
		where: { id: userId },
		update: {},
		create: {
			id: userId,
			name: data.name,
			bio: data.bio,
			avatarUrl: data.avatarUrl,
		},
	});
};
