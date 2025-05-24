-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_community_id_fkey";

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "community_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;
