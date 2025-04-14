-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false;
