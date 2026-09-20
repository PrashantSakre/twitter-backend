import Elysia from "elysia";
import { ShortUrlService } from "../services/shortUrl.service";

const service = new ShortUrlService();

export const analyticsController = new Elysia({ prefix: "/analytics" })
  .get(
  	":code",
    async ({ params: { code }, set }) => {
        try {
			const stats = await service.stats(code);
			if (!stats) {
				set.status = 404;
				return { error: "URL not found." };
			}
			
			return stats;
		} catch (e) {
			set.status = 400;
			return { error: (e as Error).message };
		}
    }
  );
