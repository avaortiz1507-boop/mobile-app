import { dbPromise } from "./sql_lite";

export type Contact = {
  id: number;
  username: string;
  password: string;
  created_at: number;
};

export const ContactsRepository = {
  // CREATE
  async createContact(email: string, passwordHash: string) {
    const db = await dbPromise;
    const result = await db.runAsync(
      `INSERT INTO contacts (username, password) VALUES (?, ?)`,
      [email, passwordHash],
    );
    return result.lastInsertRowId;
  },

  // READ ALL
  async getAllContacts() {
    const db = await dbPromise;
    return db.getAllAsync<Contact>(`SELECT * FROM contacts ORDER BY id DESC`);
  },

  // READ ONE BY ID
  async getContactById(id: number) {
    const db = await dbPromise;
    return db.getFirstAsync<Contact>(`SELECT * FROM contacts WHERE id = ?`, [
      id,
    ]);
  },

  // READ ONE BY EMAIL (for login)
  async getContactByEmail(email: string) {
    const db = await dbPromise;
    return db.getFirstAsync<Contact>(
      `SELECT * FROM contacts WHERE username = ?`,
      [email],
    );
  },

  // UPDATE
  async updateContact(id: number, email: string) {
    const db = await dbPromise;
    const result = await db.runAsync(
      `UPDATE contacts SET username = ? WHERE id = ?`,
      [email, id],
    );
    return result.changes;
  },

  // DELETE
  async deleteContact(id: number) {
    const db = await dbPromise;
    const result = await db.runAsync(`DELETE FROM contacts WHERE id = ?`, [id]);
    return result.changes;
  },
};
