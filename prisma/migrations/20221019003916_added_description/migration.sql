-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enterprise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "logo" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "contacts" TEXT NOT NULL DEFAULT 'Информация отсутствует'
);
INSERT INTO "new_Enterprise" ("contacts", "id", "logo", "title") SELECT "contacts", "id", "logo", "title" FROM "Enterprise";
DROP TABLE "Enterprise";
ALTER TABLE "new_Enterprise" RENAME TO "Enterprise";
CREATE UNIQUE INDEX "Enterprise_title_key" ON "Enterprise"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
