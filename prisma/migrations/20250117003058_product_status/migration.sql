-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SOLD');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
