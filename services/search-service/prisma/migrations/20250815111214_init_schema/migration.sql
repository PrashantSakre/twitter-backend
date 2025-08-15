-- CreateTable
CREATE TABLE "tweets" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_tweets_created_at" ON "tweets"("created_at" DESC);

-- FTS indexes
CREATE INDEX IF NOT EXISTS idx_tweets_fts
ON tweets USING gin (to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_users_fts
ON users USING gin (
  to_tsvector('english', coalesce(name,'') || ' ' )
);
