/*
  Warnings:

  - You are about to drop the `SnippetComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SnippetComment" DROP CONSTRAINT "SnippetComment_snippetId_fkey";

-- DropForeignKey
ALTER TABLE "SnippetComment" DROP CONSTRAINT "SnippetComment_userid_fkey";

-- DropTable
DROP TABLE "SnippetComment";

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
