import Elysia, { t } from "elysia";
import { ShortUrlService } from "../services/shortUrl.service";
import { code } from "../utils/genUniqueCode";

const service = new ShortUrlService();

const urlController = new Elysia({ prefix: "/url" })
	.get(
		"/:code",
		async ({ params: { code }, set }) => {
			try {
				const url = await service.getUrlByShortCode(code);
				if (!url) {
					return { message: "No records found." };
				}
				return url;
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			params: t.Object({
				code: t.String(),
			}),
		},
	)
	.post(
		"",
		async ({ body, set }) => {
			if (!body) {
				set.status = 400;
				return { error: "Invalid Data." };
			}

			const { url } = body;

			try {
				const short_url = await service.create({
					short_code: code(),
					original_url: url,
					expires_at: new Date(),
				});

				return short_url;
			} catch (e) {
				set.status = 400;
				return { error: (e as Error).message };
			}
		},
		{
			body: t.Object({
				url: t.String(),
			}),
		},
	);

export const url = new Elysia().use(urlController);
