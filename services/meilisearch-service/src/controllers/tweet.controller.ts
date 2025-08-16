import { Elysia, t } from "elysia";
import { tweetIndex, userIndex } from "../lib/meili";

export const searchController = new Elysia({ prefix: "/meilisearch" })
	// Search Tweets
	.get(
		"/tweets",
		async ({ query, set }) => {
			try {
				const q = (query.q as string) ?? "";
				const limit = Math.min(Number(query.limit ?? 20), 50);
				const offset = Number(query.offset ?? 0);
				if (!q.trim()) return { tweets: [], total: 0 };
				const result = await tweetIndex.search(q, {
					limit: limit,
					offset: offset,
					sort: ["createdAt:desc"],
				});
				return { tweets: result.hits, total: result.estimatedTotalHits };
			} catch (e) {
				set.status = 500;
				return { error: (e as Error).message };
			}
		},
		{
			query: t.Object({
				q: t.Optional(t.String()),
				limit: t.Optional(t.Numeric()),
				offset: t.Optional(t.Numeric()),
			}),
		},
	)
	// Search Users
	.get(
		"/users",
		async ({ query, set }) => {
			try {
				const q = (query.q as string) ?? "";
				const limit = Math.min(Number(query.limit ?? 20), 50);
				const offset = Number(query.offset ?? 0);
				if (!q.trim()) return { users: [], total: 0 };
				const result = await userIndex.search(q, {
					limit: limit,
					offset: offset,
				});
				return { users: result.hits, total: result.estimatedTotalHits };
			} catch (e) {
				set.status = 500;
				return { error: (e as Error).message };
			}
		},
		{
			query: t.Object({
				q: t.Optional(t.String()),
				limit: t.Optional(t.Numeric()),
				offset: t.Optional(t.Numeric()),
			}),
		},
	);
