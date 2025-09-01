/*
  Warnings:

  - You are about to drop the column `topics_id` on the `Community` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `topics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_topics_id_fkey";

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "topics_id";

-- CreateTable
CREATE TABLE "_communitiesTopics" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_communitiesTopics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_communitiesTopics_B_index" ON "_communitiesTopics"("B");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");

-- AddForeignKey
ALTER TABLE "_communitiesTopics" ADD CONSTRAINT "_communitiesTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_communitiesTopics" ADD CONSTRAINT "_communitiesTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
