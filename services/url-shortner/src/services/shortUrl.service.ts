import { AnalyticsRepository } from "../repositories/analaytics.repository";
import { CacheRepository } from "../repositories/cache.repository";
import { ShortUrlRepository } from "../repositories/ShortUrl.repository";

export class ShortUrlService {
	constructor(
		private shortRepo = new ShortUrlRepository(),
		private analyticsRepo = new AnalyticsRepository(),
	) {}

	private cache = new CacheRepository();

	async create(data: {
		short_code: string;
		original_url: string;
		expires_at?: Date;
	}) {
		return this.shortRepo.upsert(data);
	}

	async getUrlByShortCode(short_code: string) {
		const url = await this.shortRepo.findByCode(short_code);

		if (!url) return null;

		return url;
	}

	async redirect(short_code: string) {
		const cached = await this.cache.get(short_code);

		if (cached) {
			this.analyticsRepo.incrementClicks(short_code).catch(console.error);
			return cached;
		}
		const url = await this.shortRepo.findByCode(short_code);

		if (!url) return null;

		// Cache the URL
		await this.cache.set(short_code, url);

		// Fire and forget
		this.analyticsRepo.incrementClicks(short_code).catch(console.error);

		return url;
	}

	async stats(short_code: string) {
		const [url, clicks] = await Promise.all([
			this.shortRepo.findByCode(short_code),
			this.analyticsRepo.getClicks(short_code),
		]);

		if (!url) return null;

		return {
			...url,
			clicks,
		};
	}
}
