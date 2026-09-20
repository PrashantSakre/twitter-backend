import { cassandraClient } from "../config/cassandra";

export class AnalyticsRepository {
	async incrementClicks(short_code: string) {
		const query = `
      UPDATE url_shortener.short_url_clicks
      SET clicks = clicks + 1
      WHERE short_code = ?
    `;

		await cassandraClient.execute(query, [short_code], { prepare: true });
	}

	async getClicks(short_code: string) {
		const query = `
      SELECT clicks
      FROM url_shortener.short_url_clicks
      WHERE short_code = ?
    `;

		const result = await cassandraClient.execute(query, [short_code], {
			prepare: true,
		});

		return result.first()?.clicks?.toNumber() ?? 0;
	}

	async getDailyClicks(short_code: string, day: string) {
		const query = `
      SELECT clicks
      FROM url_shortener.short_url_daily_clicks
      WHERE short_code = ?
      AND day = ?
    `;

		const result = await cassandraClient.execute(query, [short_code, day], {
			prepare: true,
		});

		return result.first()?.clicks?.toNumber() ?? 0;
	}

	async getCountryClicks(short_code: string) {
		const query = `
      SELECT clicks, country
      FROM url_shortener.short_url_country_clicks
      WHERE short_code = ?
    `;

		const result = await cassandraClient.execute(query, [short_code], {
			prepare: true,
		});

		return result.first()?.clicks?.toNumber() ?? 0;
	}

	async getDeviceClicks(short_code: string) {
		const query = `
      SELECT clicks, device
      FROM url_shortener.short_url_device_clicks
      WHERE short_code = ?
    `;

		const result = await cassandraClient.execute(query, [short_code], {
			prepare: true,
		});

		return result.first()?.clicks?.toNumber() ?? 0;
	}

	async incrementDailyClicks(short_code: string, day: string) {
		const query = `
      UPDATE url_shortener.short_url_daily_clicks
      SET clicks = clicks + 1
      WHERE short_code = ?
      AND day = ?
    `;

		await cassandraClient.execute(query, [short_code, day], { prepare: true });
	}

	async incrementCountryClicks(short_code: string, country: string) {
		const query = `
      UPDATE url_shortener.short_url_country_clicks
      SET clicks = clicks + 1
      WHERE short_code = ?
      AND country = ?
    `;

		await cassandraClient.execute(query, [short_code, country], {
			prepare: true,
		});
	}

	async incrementDeviceClicks(short_code: string, device: string) {
		const query = `
      UPDATE url_shortener.short_url_device_clicks
      SET clicks = clicks + 1
      WHERE short_code = ?
      AND device = ?
    `;

		await cassandraClient.execute(query, [short_code, device], {
			prepare: true,
		});
	}
}
