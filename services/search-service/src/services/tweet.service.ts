import { prisma } from "../config/db";

type Page = { limit: number; offset: number };
interface Tweet {
	id: string;
	authorId: string;
	content: string;
}
interface User {
	id: string;
	name: string;
	avatarUrl: string;
}

export const searchTweets = async (q: string, page: Page) => {
	// Use Postgres FTS via raw SQL for best performance
	const tweets = await prisma.$queryRawUnsafe<Tweet[]>(
		`SELECT id, author_id as "authorId", content, created_at as "createdAt"
     FROM tweets
     WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
		q,
		page.limit,
		page.offset,
	);

	const totalRows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
		`SELECT COUNT(*)::bigint as count
     FROM tweets
     WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)`,
		q,
	);

	const total = Number(totalRows?.[0]?.count ?? 0);
	return { tweets, total };
};

export const searchUsers = async (q: string, page: Page) => {
	const users = await prisma.$queryRawUnsafe<User[]>(
		`SELECT id, name, avatar_url as "avatarUrl"
     FROM users
     WHERE to_tsvector('english', coalesce(name,'') || ' ' )
           @@ plainto_tsquery('english', $1)
     ORDER BY name ASC
     LIMIT $2 OFFSET $3`,
		q,
		page.limit,
		page.offset,
	);

	const totalRows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
		`SELECT COUNT(*)::bigint as count
     FROM users
     WHERE to_tsvector('english', coalesce(name,'') || ' ' )
           @@ plainto_tsquery('english', $1)`,
		q,
	);

	const total = Number(totalRows?.[0]?.count ?? 0);
	return { users, total };
};
