/*
  Warnings:

  - The values [INSTAGRAM] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('WEBPAGE', 'YOUTUBE', 'CODE', 'NOTE');
ALTER TABLE "Collections" ALTER COLUMN "contentType" TYPE "ContentType_new"[] USING ("contentType"::text::"ContentType_new"[]);
ALTER TABLE "Contents" ALTER COLUMN "contentType" TYPE "ContentType_new"[] USING ("contentType"::text::"ContentType_new"[]);
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "ContentType_old";
COMMIT;
