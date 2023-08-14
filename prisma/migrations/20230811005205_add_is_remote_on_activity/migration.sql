/*
  Warnings:

  - Added the required column `isRemote` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRemote` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "isRemote" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "UserActivity" ADD COLUMN     "isRemote" BOOLEAN NOT NULL;
