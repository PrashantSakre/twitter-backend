import { redisClient } from "../config/redis";

export class CacheRepository {
	private readonly PREFIX = "shorturl:";

	async get(shortCode: string) {
		const data = await redisClient.get(this.PREFIX + shortCode);

		if (!data) return null;

		return JSON.parse(data);
	}

	async set(shortCode: string, value: object, ttl = 3600) {
		await redisClient.set(this.PREFIX + shortCode, JSON.stringify(value), {
			EX: ttl,
		});
	}

	async del(shortCode: string) {
		await redisClient.del(this.PREFIX + shortCode);
	}
}
