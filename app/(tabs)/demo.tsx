import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Simple beginner-style demo page that shows plain HTML tags as text
export default function DemoScreen() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>{"<h1>Demo Page</h1>"}</ThemedText>
      <ThemedText>{"<p>This is a simple demo page.</p>"}</ThemedText>
    </ThemedView>
  );
}
