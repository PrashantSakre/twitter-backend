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

	async redirect(short_code: string, country: string, device: string) {
		const cached = await this.cache.get(short_code);

		if (cached) {
			this.fireAnalytics(short_code, country, device);
			return cached;
		}
		const url = await this.shortRepo.findByCode(short_code);

		if (!url) return null;

		// Cache the URL
		await this.cache.set(short_code, url);

		// Fire and forget
		this.fireAnalytics(short_code, country, device);

		return url;
	}

	fireAnalytics(short_code: string, country: string, device: string) {
		const today = new Date().toISOString().slice(0, 10);
		this.analyticsRepo.incrementClicks(short_code).catch(console.error);
		this.analyticsRepo
			.incrementDailyClicks(short_code, today)
			.catch(console.error);
		this.analyticsRepo
			.incrementCountryClicks(short_code, country)
			.catch(console.error);
		this.analyticsRepo
			.incrementDeviceClicks(short_code, device)
			.catch(console.error);
		this.analyticsRepo.incrementClicks(short_code).catch(console.error);
	}

	async stats(short_code: string) {
		const [url, totalClicks, today, countries, devices] = await Promise.all([
			this.shortRepo.findByCode(short_code),
			this.analyticsRepo.getClicks(short_code),
			this.analyticsRepo.getDailyClicks(
				short_code,
				new Date().toISOString().slice(0, 10),
			),
			this.analyticsRepo.getCountryClicks(short_code),
			this.analyticsRepo.getDeviceClicks(short_code),
		]);
		if (!url) return null;

		return {
			...url,
			totalClicks,
			today,
			countries,
			devices,
		};
	}
}
