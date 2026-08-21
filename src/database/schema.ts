import { dbPromise } from "./sql_lite";

export const createTables = async () => {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const currentVersion = await getSchemaVersion();

  await db.withTransactionAsync(async () => {
    if (currentVersion < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);

      await setSchemaVersion(1);
    }

    if (currentVersion < 2) {
      await db.execAsync(`
        ALTER TABLE contacts ADD COLUMN created_at INTEGER DEFAULT 0;
      `);

      await setSchemaVersion(2);
    }

    if (currentVersion < 3) {
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_contacts_username
        ON contacts (username);
      `);

      await setSchemaVersion(3);
    }
  });
};

export const getSchemaVersion = async (): Promise<number> => {
  const db = await dbPromise;
  const result = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM metadata WHERE key = 'schema_version'`,
  );
  return result ? Number(result.value) : 0;
};
const setSchemaVersion = async (version: number) => {
  const db = await dbPromise;
  await db.runAsync(
    `
      INSERT OR REPLACE INTO metadata (key, value)
      VALUES ('schema_version', ?);
    `,
    String(version),
  );
};
