import { ShortUrlRepository } from "../repositories/ShortUrl.repository";
import { AnalyticsRepository } from "../repositories/analaytics.repository";

export class ShortUrlService {
	constructor(
		private shortRepo = new ShortUrlRepository(),
		private analyticsRepo = new AnalyticsRepository(),
	) {}

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
		const url = await this.shortRepo.findByCode(short_code);

		if (!url) return null;

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
