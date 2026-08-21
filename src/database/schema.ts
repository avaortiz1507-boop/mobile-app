import { db } from "./sql_lite";

export const createTables = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const currentVersion = getSchemaVersion();

  db.withTransactionSync(() => {
    if (currentVersion < 1) {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);

      setSchemaVersion(1);
    }

    if (currentVersion < 2) {
      db.execSync(`
        ALTER TABLE contacts ADD COLUMN created_at INTEGER DEFAULT 0;
      `);

      setSchemaVersion(2);
    }

    if (currentVersion < 3) {
      db.execSync(`
        CREATE INDEX IF NOT EXISTS idx_contacts_username
        ON contacts (username);
      `);

      setSchemaVersion(3);
    }
  });
};

export const getSchemaVersion = (): number => {
  const result = db.getFirstSync<{ value: string }>(
    `SELECT value FROM metadata WHERE key = 'schema_version'`,
  );
  return result ? Number(result.value) : 0;
};
const setSchemaVersion = (version: number) => {
  db.runSync(
    `
      INSERT OR REPLACE INTO metadata (key, value)
      VALUES ('schema_version', ?);
    `,
    String(version),
  );
};
