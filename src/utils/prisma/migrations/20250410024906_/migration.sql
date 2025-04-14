/*
  Warnings:

  - The `refresh_token` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "refresh_token_expired_at" TIMESTAMPTZ,
DROP COLUMN "refresh_token",
ADD COLUMN     "refresh_token" UUID;
