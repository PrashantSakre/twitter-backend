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
}
