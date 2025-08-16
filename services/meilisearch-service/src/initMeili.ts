import { tweetIndex, userIndex } from "./lib/meili";

export async function init() {
	await tweetIndex.updateSettings({
		searchableAttributes: ["content"],
		filterableAttributes: ["authorId", "createdAt"],
		sortableAttributes: ["createdAt"],
	});

	await userIndex.updateSettings({
		searchableAttributes: ["name"],
		filterableAttributes: [],
	});

	console.log("✅ Meilisearch indexes initialized");
}
