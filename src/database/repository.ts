import { db } from "./sql_lite";

export type Contact = {
  id: number;
  username: string;
  password: string;
  created_at: number;
};

export const ContactsRepository = {
  // CREATE
  async createContact(email: string, passwordHash: string) {
    const result = db.runSync(
      `INSERT INTO contacts (username, password) VALUES (?, ?)`,
      [email, passwordHash],
    );
    return result.lastInsertRowId;
  },

  // READ ALL
  async getAllContacts() {
    return db.getAllSync<Contact>(`SELECT * FROM contacts ORDER BY id DESC`);
  },

  // READ ONE BY ID
  async getContactById(id: number) {
    return db.getFirstSync<Contact>(`SELECT * FROM contacts WHERE id = ?`, [
      id,
    ]);
  },

  // READ ONE BY EMAIL (for login)
  async getContactByEmail(email: string) {
    return db.getFirstSync<Contact>(
      `SELECT * FROM contacts WHERE username = ?`,
      [email],
    );
  },

  // UPDATE
  async updateContact(id: number, email: string) {
    const result = db.runSync(`UPDATE contacts SET username = ? WHERE id = ?`, [
      email,
      id,
    ]);
    return result.changes;
  },

  // DELETE
  async deleteContact(id: number) {
    const result = db.runSync(`DELETE FROM contacts WHERE id = ?`, [id]);
    return result.changes;
  },
};
