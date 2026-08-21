import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Contact, ContactsRepository } from "@/src/database/repository";
import { createTables } from "@/src/database/schema";

export default function CrudTestScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [message, setMessage] = useState("Loading contacts...");

  const loadContacts = async () => {
    const rows = await ContactsRepository.getAllContacts();
    setContacts(rows);
    setMessage(`${rows.length} contact${rows.length === 1 ? "" : "s"} found`);
  };

  useEffect(() => {
    void createTables()
      .then(loadContacts)
      .catch((error) => {
        console.error("Failed to load contacts:", error);
        setMessage("Could not load contacts");
      });
  }, []);

  const addContact = async () => {
    if (!email.trim() || !password) {
      setMessage("Enter a username and password first");
      return;
    }

    try {
      await ContactsRepository.createContact(email.trim(), password);
      setEmail("");
      setPassword("");
      await loadContacts();
      setMessage("Contact created");
    } catch (error) {
      console.error("Failed to create contact:", error);
      setMessage("Could not create contact");
    }
  };

  const startEditing = (contact: Contact) => {
    setEditingContactId(contact.id);
    setEmail(contact.username);
    setPassword("");
    setMessage(`Editing contact #${contact.id}`);
  };

  const cancelEditing = () => {
    setEditingContactId(null);
    setEmail("");
    setPassword("");
    setMessage("Edit cancelled");
  };

  const updateContact = async () => {
    if (editingContactId === null || !email.trim()) {
      setMessage("Enter a username first");
      return;
    }

    try {
      await ContactsRepository.updateContact(editingContactId, email.trim());
      cancelEditing();
      await loadContacts();
      setMessage("Contact updated");
    } catch (error) {
      console.error("Failed to update contact:", error);
      setMessage("Could not update contact");
    }
  };

  const performDelete = async (id: number) => {
    try {
      const changes = await ContactsRepository.deleteContact(id);
      if (editingContactId === id) {
        cancelEditing();
      }
      await loadContacts();
      setMessage(changes === 1 ? "Contact deleted" : "Contact was not found");
    } catch (error) {
      console.error("Failed to delete contact:", error);
      setMessage("Could not delete contact");
    }
  };

  const deleteContact = (id: number) => {
    if (Platform.OS === "web") {
      if (
        globalThis.confirm("Delete this contact? This action cannot be undone.")
      ) {
        void performDelete(id);
      }
      return;
    }

    Alert.alert("Delete contact?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => void performDelete(id),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ThemedText type="title">CRUD Test</ThemedText>
      <ThemedText>Test creating and reading contacts from SQLite.</ThemedText>

      <ThemedView style={styles.form}>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Username"
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {editingContactId === null ? (
          <Pressable onPress={() => void addContact()} style={styles.button}>
            <ThemedText style={styles.buttonText}>Create contact</ThemedText>
          </Pressable>
        ) : (
          <View style={styles.actions}>
            <Pressable
              onPress={() => void updateContact()}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>Update contact</ThemedText>
            </Pressable>
            <Pressable onPress={cancelEditing} style={styles.secondaryButton}>
              <ThemedText>Cancel</ThemedText>
            </Pressable>
          </View>
        )}
      </ThemedView>

      <ThemedText>{message}</ThemedText>
      <View style={styles.list}>
        {contacts.map((contact) => (
          <ThemedView key={contact.id} style={styles.contact}>
            <View>
              <ThemedText>{contact.username}</ThemedText>
              <ThemedText>#{contact.id}</ThemedText>
            </View>
            <View style={styles.rowActions}>
              <Pressable onPress={() => startEditing(contact)}>
                <ThemedText type="link">Edit</ThemedText>
              </Pressable>
              <Pressable onPress={() => deleteContact(contact.id)}>
                <ThemedText style={styles.deleteText}>Delete</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 24,
  },
  form: {
    gap: 12,
    padding: 16,
    borderRadius: 8,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  button: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#2563eb",
  },
  buttonText: {
    color: "#fff",
  },
  secondaryButton: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
  },
  actions: {
    gap: 8,
  },
  list: {
    gap: 8,
  },
  contact: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 6,
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deleteText: {
    color: "#b91c1c",
  },
});
