-- CreateTable
CREATE TABLE "Enterprise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "contacts" TEXT NOT NULL DEFAULT 'Информация отсутствует'
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vacancy" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "requirements" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "docs" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "salary" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Vacancy_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Enterprise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "small" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "large" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "alt" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Photo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Enterprise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Marker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    "top" INTEGER NOT NULL DEFAULT 0,
    "left" INTEGER NOT NULL DEFAULT 0,
    "corner" TEXT NOT NULL DEFAULT 'Информация отсутствует',
    CONSTRAINT "Marker_id_fkey" FOREIGN KEY ("id") REFERENCES "Enterprise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Enterprise_title_key" ON "Enterprise"("title");
