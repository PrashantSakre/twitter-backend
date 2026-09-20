import Elysia, { t } from "elysia";
import QRCode from "qrcode";
import { ShortUrlService } from "../services/shortUrl.service";
import { code } from "../utils/genUniqueCode";

const service = new ShortUrlService();

const urlController = new Elysia({ prefix: "/url" })
	.get(
		"/:code/qrcode",
		async ({ params: { code }, set }) => {
			try {
				const url = await service.getUrlByShortCode(code);
				if (!url) {
					return { message: "No records found." };
				}

				const dataUrl = await QRCode.toDataURL(url.original_url);
				return dataUrl;
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
				const parsedUrl = new URL(url);
				const hostname = parsedUrl.hostname;

				if (hostname === "localhost" || hostname.startsWith("127.")) {
					return { error: "Local addresses not allowed" };
				}
				if (!["http:", "https:"].includes(parsedUrl.protocol)) {
					set.status = 400;
					return { error: "Only HTTP and HTTPS URLs are allowed." };
				}
			} catch {
				set.status = 400;
				return { error: "Invalid URL." };
			}

			try {
				const expiryHours = Number(process.env.EXPIRY_HOURS || 24);
				const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

				const short_url = await service.create({
					short_code: code(),
					original_url: url,
					expires_at: expiresAt,
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
