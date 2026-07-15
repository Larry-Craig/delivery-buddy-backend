-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "workId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentRate" TEXT NOT NULL DEFAULT '15%',
    "transportation" TEXT NOT NULL DEFAULT 'BICYCLE',
    "walletBalance" REAL NOT NULL DEFAULT 0.0,
    "tipsBalance" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "earnings" REAL NOT NULL DEFAULT 0.0,
    "tips" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "pickupName" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "destinationAddress" TEXT NOT NULL,
    "itemsJson" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "tip" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Credit Card'
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_workId_key" ON "User"("workId");
