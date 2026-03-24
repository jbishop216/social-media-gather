import { createClient } from "@libsql/client";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.log("No DATABASE_URL set, skipping DB setup.");
  process.exit(0);
}

// Parse combined URL format: libsql://host?authToken=token
let url = dbUrl;
let authToken = undefined;
if (dbUrl.includes("?authToken=")) {
  const parts = dbUrl.split("?authToken=");
  url = parts[0];
  authToken = parts[1];
}

// Skip setup for local file databases
if (url.startsWith("file:")) {
  console.log("Local file database, skipping remote DB setup.");
  process.exit(0);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("Setting up database schema...");

  await client.execute(`CREATE TABLE IF NOT EXISTS "User" (
    "id"           TEXT     NOT NULL PRIMARY KEY,
    "email"        TEXT     NOT NULL,
    "name"         TEXT,
    "passwordHash" TEXT     NOT NULL,
    "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await client.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`
  );

  await client.execute(`CREATE TABLE IF NOT EXISTS "DataRequest" (
    "id"             TEXT     NOT NULL PRIMARY KEY,
    "platform"       TEXT     NOT NULL,
    "status"         TEXT     NOT NULL DEFAULT 'pending',
    "userId"         TEXT     NOT NULL,
    "archiveUrl"     TEXT,
    "statusNote"     TEXT,
    "requestedAt"    DATETIME,
    "estimatedReady" DATETIME,
    "completedAt"    DATETIME,
    "createdAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataRequest_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
  )`);

  await client.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS "DataRequest_userId_platform_key" ON "DataRequest"("userId", "platform")`
  );

  console.log("Database schema ready.");
}

main().catch((err) => {
  console.error("DB setup failed:", err);
  process.exit(1);
});
