import { prisma } from "../config/prisma";

export class ShortUrlRepository {
	async create(data: {
		short_code: string;
		original_url: string;
		expires_at?: Date;
	}) {
		return prisma.shorturl.create({
			data,
		});
	}

	async findByCode(short_code: string) {
		return prisma.shorturl.findUnique({
			where: { short_code },
		});
	}

	async upsert(data: {
		short_code: string;
		original_url?: string;
		expires_at?: Date;
	}) {
		return await prisma.Shorturl.upsert({
			where: { short_code: data.short_code },
			update: {
				short_code: data.short_code,
				original_url: data.original_url,
				expires_at: data.expires_at,
			},
			create: data,
			select: {
				short_code: true,
				original_url: true,
				expires_at: true,
				createdAt: true,
			},
		});
	}
}
