const ROUTES = [
  {
    url: "/api/users",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.USER_SERVICE_URL}/api/users`,
      changeOrigin: true,
    },
  },
  {
    url: "/api/auth",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.AUTH_SERVICE_URL}/api/auth`,
      changeOrigin: true,
    },
  },
  {
    url: "/api/tweets",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.TWEET_SERVICE_URL}/api/tweets`,
      changeOrigin: true,
    },
	},
	{
    url: "/api/replies",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.REPLY_SERVICE_URL}/api/replies`,
      changeOrigin: true,
    },
	},
	{
    url: "/api/timeline",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.TIMELINE_SERVICE_URL}/api/timeline`,
      changeOrigin: true,
    },
	},
	{
    url: "/api/likes",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.LIKE_SERVICE_URL}/api/likes`,
      changeOrigin: true,
    },
	},
	{
    url: "/api/notifications",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
      changeOrigin: true,
    },
	},
	{
    url: "/api/search",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.SEARCH_SERVICE_URL}/api/search`,
      changeOrigin: true,
    },
  },
	{
    url: "/api/meilisearch",
    rateLimit: {
      windowMs: 1 * 60 * 1000,
      limit: 5,
    },
    proxy: {
      target: `${process.env.MEILISEARCH_SERVICE_URL}/api/meilisearch`,
      changeOrigin: true,
    },
  },
];

exports.ROUTES = ROUTES;
