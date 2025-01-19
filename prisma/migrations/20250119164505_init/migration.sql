-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('persons', 'organizations', 'locations');

-- CreateTable
CREATE TABLE "threads" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "url" TEXT,
    "site_full" TEXT,
    "site" TEXT,
    "site_section" TEXT,
    "section_title" TEXT,
    "title" TEXT,
    "title_full" TEXT,
    "published" TIMESTAMP(3),
    "replies_count" INTEGER,
    "participants_count" INTEGER,
    "site_type" TEXT,
    "main_image" TEXT,
    "country" TEXT,
    "site_categories" TEXT[],
    "performance_score" INTEGER,
    "domain_rank" INTEGER,
    "domain_rank_updated" TIMESTAMP(3),

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social" (
    "id" TEXT NOT NULL,
    "vk_shares" INTEGER,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_metrics" (
    "id" TEXT NOT NULL,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "socialId" TEXT NOT NULL,

    CONSTRAINT "facebook_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "url" TEXT,
    "ord_in_thread" INTEGER,
    "parent_url" TEXT,
    "author" TEXT,
    "published" TIMESTAMP(3),
    "title" TEXT,
    "text" TEXT,
    "language" TEXT,
    "highlight_text" TEXT,
    "highlight_title" TEXT,
    "highlight_thread_title" TEXT,
    "sentiment" TEXT,
    "categories" TEXT[],
    "topics" TEXT[],
    "ai_allow" BOOLEAN,
    "has_canonical" BOOLEAN,
    "webz_reporter" BOOLEAN,
    "crawled" TIMESTAMP(3),
    "updated" TIMESTAMP(3),
    "rating" DOUBLE PRECISION,
    "threadId" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "EntityType",
    "sentiment" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_links" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "external_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_images" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "meta_info" TEXT,
    "uuid" TEXT,
    "labels" TEXT[],
    "postId" TEXT NOT NULL,

    CONSTRAINT "external_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "syndications" (
    "id" TEXT NOT NULL,
    "syndicated" BOOLEAN,
    "syndicate_id" TEXT,
    "first_syndicated" BOOLEAN,
    "postId" TEXT NOT NULL,

    CONSTRAINT "syndications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "threads_uuid_key" ON "threads"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "social_threadId_key" ON "social"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_metrics_socialId_key" ON "facebook_metrics"("socialId");

-- CreateIndex
CREATE UNIQUE INDEX "posts_uuid_key" ON "posts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "posts_threadId_key" ON "posts"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "syndications_postId_key" ON "syndications"("postId");

-- AddForeignKey
ALTER TABLE "social" ADD CONSTRAINT "social_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_metrics" ADD CONSTRAINT "facebook_metrics_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_links" ADD CONSTRAINT "external_links_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_images" ADD CONSTRAINT "external_images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "syndications" ADD CONSTRAINT "syndications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
