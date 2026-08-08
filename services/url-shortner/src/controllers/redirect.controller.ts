import Elysia, { t } from "elysia";
import { ShortUrlService } from "../services/shortUrl.service";

const service = new ShortUrlService();

export const redirectController = new Elysia().get(
	"/:code",
	async ({ params: { code }, set, redirect }) => {
		try {
			const url = await service.redirect(code);
			if (!url) {
				set.status = 404;
				return { error: "URL not found." };
			}
			if (url.expires_at && new Date(url.expires_at) < new Date()) {
				return { error: "URL expired." };
			}
			set.status = 302;
			console.log(url);
			redirect(url.original_url, 302);
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
);
