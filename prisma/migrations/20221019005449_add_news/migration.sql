-- CreateTable
CREATE TABLE "News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "description" TEXT NOT NULL DEFAULT 'Информация отсутствует'
);

-- CreateTable
CREATE TABLE "NewsPhoto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "small" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "large" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "alt" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "newsId" INTEGER NOT NULL,
    CONSTRAINT "NewsPhoto_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
