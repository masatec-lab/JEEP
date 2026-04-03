-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "priceNote" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "difficultyLabel" TEXT NOT NULL,
    "maxPassengers" INTEGER NOT NULL,
    "highlights" TEXT NOT NULL,
    "included" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "startPoint" TEXT NOT NULL,
    "startPoints" TEXT NOT NULL DEFAULT '[]',
    "hunterEnabled" BOOLEAN NOT NULL DEFAULT true,
    "patriotEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pricePatriot" INTEGER NOT NULL DEFAULT 0,
    "extraHourPrice" INTEGER NOT NULL DEFAULT 0,
    "maxExtraHours" INTEGER NOT NULL DEFAULT 0,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Route" ("active", "createdAt", "description", "difficulty", "difficultyLabel", "duration", "extraHourPrice", "gallery", "highlights", "id", "image", "included", "maxExtraHours", "maxPassengers", "name", "order", "popular", "price", "priceNote", "pricePatriot", "shortDescription", "slug", "startPoint", "startPoints", "updatedAt") SELECT "active", "createdAt", "description", "difficulty", "difficultyLabel", "duration", "extraHourPrice", "gallery", "highlights", "id", "image", "included", "maxExtraHours", "maxPassengers", "name", "order", "popular", "price", "priceNote", "pricePatriot", "shortDescription", "slug", "startPoint", "startPoints", "updatedAt" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
CREATE UNIQUE INDEX "Route_slug_key" ON "Route"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
