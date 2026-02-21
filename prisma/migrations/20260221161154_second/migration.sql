-- CreateEnum
CREATE TYPE "InvestorPipelineStatus" AS ENUM ('NONE', 'REVIEWED', 'PASSED', 'MEETING_SCHEDULED');

-- CreateEnum
CREATE TYPE "DigestFrequency" AS ENUM ('NONE', 'DAILY', 'WEEKLY');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "InvestorProfile" ADD COLUMN     "accredited_investor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "calendar_url" TEXT,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "looking_for" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "StartupProfile" ADD COLUMN     "calendar_url" TEXT,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "looking_for" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "calendar_url" TEXT,
ADD COLUMN     "digest_frequency" "DigestFrequency" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deactivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notify_on_match_accepted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_on_match_request" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "onboarding_completed_at" TIMESTAMP(3),
ADD COLUMN     "privacy_accepted_at" TIMESTAMP(3),
ADD COLUMN     "terms_accepted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "match_requests" ADD COLUMN     "application_answers" JSONB,
ADD COLUMN     "investor_notes" TEXT,
ADD COLUMN     "investor_status" "InvestorPipelineStatus" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "startup_team_members" (
    "id" TEXT NOT NULL,
    "startup_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "linked_in_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startup_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_portfolios" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_shortlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "startup_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "startup_shortlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_shortlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_shortlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_messages" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "startup_shortlists_user_id_startup_id_key" ON "startup_shortlists"("user_id", "startup_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_shortlists_user_id_investor_id_key" ON "investor_shortlists"("user_id", "investor_id");

-- AddForeignKey
ALTER TABLE "startup_team_members" ADD CONSTRAINT "startup_team_members_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_portfolios" ADD CONSTRAINT "investor_portfolios_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "InvestorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_shortlists" ADD CONSTRAINT "startup_shortlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_shortlists" ADD CONSTRAINT "startup_shortlists_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_shortlists" ADD CONSTRAINT "investor_shortlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_shortlists" ADD CONSTRAINT "investor_shortlists_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "InvestorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
