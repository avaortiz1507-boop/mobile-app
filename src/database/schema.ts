import { db } from "./sql_lite";

export const createTables = () => {
  db.withTransactionSync(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_contacts_username
        ON contacts (username);
    `);
  });
};
