import { MeiliSearch } from "meilisearch";
import { PrismaClient as TweetPrisma } from "../../../tweet-service/node_modules/@prisma/client"; // from tweet-service schema
import { PrismaClient as UserPrisma } from "../../../user-service/node_modules/@prisma/client"; // from user-service schema

// Meilisearch client
const meili = new MeiliSearch({
	host: process.env.MEILI_HOST || "http://127.0.0.1:7700",
	apiKey: process.env.MEILI_MASTER_KEY || "masterKey",
});

// Configure DB connections
// Adjust DATABASE_URL_TWEETS and DATABASE_URL_USERS to point to the main DBs
const tweetPrisma = new TweetPrisma({
	datasourceUrl: process.env.DATABASE_URL_TWEETS,
});
const userPrisma = new UserPrisma({
	datasourceUrl: process.env.DATABASE_URL_USERS,
});

async function backfillTweets(batchSize = 500) {
	console.log("⬆️ Backfilling tweets...");
	let cursor = 0;

	while (true) {
		const tweets = await tweetPrisma.tweet.findMany({
			skip: cursor,
			take: batchSize,
			orderBy: { createdAt: "asc" },
			select: {
				id: true,
				authorId: true,
				content: true,
				createdAt: true,
			},
		});

		if (tweets.length === 0) break;

		await meili.index("tweets").addDocuments(tweets, { primaryKey: "id" });

		console.log(`✅ Indexed ${cursor + tweets.length} tweets so far...`);

		cursor += batchSize;
	}

	console.log("🎉 Finished backfilling tweets.");
}

async function backfillUsers(batchSize = 500) {
	console.log("⬆️ Backfilling users...");
	let cursor = 0;

	while (true) {
		const users = await userPrisma.user.findMany({
			skip: cursor,
			take: batchSize,
			orderBy: { name: "asc" },
			select: {
				id: true,
				bio: true,
				name: true,
				avatarUrl: true,
			},
		});

		if (users.length === 0) break;

		await meili.index("users").addDocuments(users, { primaryKey: "id" });

		console.log(`✅ Indexed ${cursor + users.length} users so far...`);

		cursor += batchSize;
	}

	console.log("🎉 Finished backfilling users.");
}

async function main() {
	try {
		await backfillTweets();
		await backfillUsers();
	} catch (e) {
		console.error("❌ Backfill failed:", e);
	} finally {
		await tweetPrisma.$disconnect();
		await userPrisma.$disconnect();
	}
}

main();
