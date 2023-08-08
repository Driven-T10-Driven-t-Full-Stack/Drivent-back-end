/*
  Warnings:

  - Changed the type of `local` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "local",
ADD COLUMN     "local" TEXT NOT NULL;

-- DropEnum
DROP TYPE "LocalActivity";
