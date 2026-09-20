import Elysia, { t } from "elysia";
import { ShortUrlService } from "../services/shortUrl.service";

const service = new ShortUrlService();

export const redirectController = new Elysia().get(
	"/:code",
	async ({ params: { code }, set, redirect, request }) => {
		try {
			const country = request.headers.get("cf-ipcountry") ?? "UNKNOWN";
			const ua = request.headers.get("user-agent") ?? "";
			const device = /mobile/i.test(ua) ? "mobile" : "desktop";

			const url = await service.redirect(code, country, device);
			if (!url) {
				set.status = 404;
				return { error: "URL not found." };
			}
			if (url.expires_at && new Date(url.expires_at) < new Date()) {
				set.status = 410;
				return { error: "URL expired." };
			}

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
