/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token_expired_at` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "refresh_token",
DROP COLUMN "refresh_token_expired_at";

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" UUID NOT NULL,
    "refreshToken" UUID NOT NULL,
    "expired_at" TIMESTAMPTZ NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_refreshToken_key" ON "refresh_token"("refreshToken");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
