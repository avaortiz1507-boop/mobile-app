import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Button } from "react-native";

// mock api
function mockFetchApi(): Promise<{
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false,
      });
    }, 1000);
  });
}

export default function DemoScreen() {
  const [toDo, setToDo] = useState<{
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  } | null>(null);
  const [status, setStatus] = useState<"idle" | "polling" | "pause">("idle");
  const [lastFetch, setLastFetch] = useState<string | null>(null);

  const isPolling = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const poll = async () => {
    if (!isPolling.current) return;

    if (isPolling.current) {
      setStatus("polling");
      timeoutRef.current = setTimeout(poll, 5000);
    }
    try {
      const data = await mockFetchApi();
      setToDo(data);
      setLastFetch(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching API data:", error);
    } // slide 6 to finish
  };

  const stopPolling = () => {
    isPolling.current = false;
    setStatus("pause");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startPolling = () => {
    if (isPolling.current) return;
    isPolling.current = true;
    poll();
  };

  const handleStop = () => {
    stopPolling();
    setStatus("idle");
  };

  useEffect(() => {}, []);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>{"<h1>Demo Page</h1>"}</ThemedText>
      <ThemedText>{"<p>This is a simple demo page.</p>"}</ThemedText>
      <ThemedText>
        {"<p>Last Fetch: " + (lastFetch || "N/A") + "</p>"}
      </ThemedText>
      <ThemedText>{"<p>Status: " + status + "</p>"}</ThemedText>
      <ThemedText>
        {"<p>ToDo: " + (toDo ? JSON.stringify(toDo) : "N/A") + "</p>"}
      </ThemedText>
      <Button title="Start Polling" onPress={startPolling} />
      <Button title="Stop Polling" onPress={handleStop} />
    </ThemedView>
  );
}
