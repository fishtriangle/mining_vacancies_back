-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'Информация отсутствует'
);
INSERT INTO "new_News" ("date", "description", "id", "title") SELECT "date", "description", "id", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_title_key" ON "News"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
