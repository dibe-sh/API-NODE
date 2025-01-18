-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('persons', 'organizations', 'locations');

-- CreateTable
CREATE TABLE "threads" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "site_full" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "site_section" TEXT NOT NULL,
    "section_title" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_full" TEXT NOT NULL,
    "published" TIMESTAMP(3) NOT NULL,
    "replies_count" INTEGER NOT NULL,
    "participants_count" INTEGER NOT NULL,
    "site_type" TEXT NOT NULL,
    "main_image" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "site_categories" TEXT[],
    "performance_score" INTEGER NOT NULL,
    "domain_rank" INTEGER NOT NULL,
    "domain_rank_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social" (
    "id" TEXT NOT NULL,
    "vk_shares" INTEGER NOT NULL,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_metrics" (
    "id" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "socialId" TEXT NOT NULL,

    CONSTRAINT "facebook_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ord_in_thread" INTEGER NOT NULL,
    "parent_url" TEXT,
    "author" TEXT,
    "published" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "highlight_text" TEXT,
    "highlight_title" TEXT,
    "highlight_thread" TEXT,
    "sentiment" TEXT NOT NULL,
    "categories" TEXT[],
    "topics" TEXT[],
    "ai_allow" BOOLEAN NOT NULL,
    "has_canonical" BOOLEAN NOT NULL,
    "webz_reporter" BOOLEAN NOT NULL,
    "crawled" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,
    "rating" DOUBLE PRECISION,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,
    "sentiment" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "external_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "meta_info" TEXT,
    "uuid" TEXT NOT NULL,
    "labels" TEXT[],
    "postId" TEXT NOT NULL,

    CONSTRAINT "external_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "syndications" (
    "id" TEXT NOT NULL,
    "syndicated" BOOLEAN NOT NULL,
    "syndicate_id" TEXT,
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
CREATE UNIQUE INDEX "syndications_postId_key" ON "syndications"("postId");

-- AddForeignKey
ALTER TABLE "social" ADD CONSTRAINT "social_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_metrics" ADD CONSTRAINT "facebook_metrics_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_links" ADD CONSTRAINT "external_links_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_images" ADD CONSTRAINT "external_images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "syndications" ADD CONSTRAINT "syndications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
