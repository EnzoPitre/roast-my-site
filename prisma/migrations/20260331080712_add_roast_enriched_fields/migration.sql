-- AlterTable
ALTER TABLE "roasts" ADD COLUMN     "competitorComparison" TEXT,
ADD COLUMN     "conversionEstimate" TEXT,
ADD COLUMN     "quickWins" JSONB,
ADD COLUMN     "topOpportunity" TEXT;
