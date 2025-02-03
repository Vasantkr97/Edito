/*
  Warnings:

  - A unique constraint covering the columns `[userId,snippetId]` on the table `Star` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Star_userId_snippetId_key" ON "Star"("userId", "snippetId");
