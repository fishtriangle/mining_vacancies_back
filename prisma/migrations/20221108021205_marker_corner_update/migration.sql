-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Marker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "top" INTEGER NOT NULL DEFAULT 0,
    "left" INTEGER NOT NULL DEFAULT 0,
    "corner" TEXT NOT NULL DEFAULT 'top-left',
    CONSTRAINT "Marker_id_fkey" FOREIGN KEY ("id") REFERENCES "Enterprise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Marker" ("corner", "id", "left", "top", "value") SELECT "corner", "id", "left", "top", "value" FROM "Marker";
DROP TABLE "Marker";
ALTER TABLE "new_Marker" RENAME TO "Marker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
