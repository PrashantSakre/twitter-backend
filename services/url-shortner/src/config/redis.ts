import { createClient } from "redis";

// Create the Redis client (Defaults to 127.0.0.1:6379)
export const redisClient = createClient({
	url: process.env.REDIS_URL,
});

export async function initializeRedis() {
	// Setup error handling event listeners
	redisClient.on("error", (err) => console.error("Redis Client Error", err));
	redisClient.on("connect", () =>
		console.log("Successfully connected to Redis!"),
	);

	// Explicitly connect to the Redis server
	await redisClient.connect();
}

initializeRedis();
