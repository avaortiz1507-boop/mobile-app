import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Button, TextInput } from "react-native";

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
  const [volatileValue, setVolatileValue] = useState("0");

  const isPolling = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const stopPolling = useCallback(() => {
    isPolling.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("pause");
  }, []);

  const poll = useCallback(async () => {
    if (!isPolling.current) return;

    setStatus("polling");
    timeoutRef.current = setTimeout(() => {
      void poll();
    }, 5000);

    try {
      const data = await mockFetchApi();
      if (!isPolling.current) return;
      setToDo(data);
      setLastFetch(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (isPolling.current) return;
    isPolling.current = true;
    void poll();
  }, [poll]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appState.current;
      appState.current = nextState;

      if (
        previousState === "active" &&
        nextState.match(/inactive|background/)
      ) {
        stopPolling();
      } else if (
        previousState.match(/inactive|background/) &&
        nextState === "active"
      ) {
        if (isPolling.current) {
          setStatus("polling");
          void poll();
        }
      }
    });

    return () => subscription.remove();
  }, [poll, stopPolling]);

  const handleStop = () => {
    stopPolling();
    setStatus("idle");
  };

  const handleSimulateRequest = async () => {
    setStatus("polling");
    try {
      const data = await mockFetchApi();
      setToDo(data);
      setLastFetch(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
        Demo Page
      </ThemedText>
      <ThemedText>This is a simple demo page.</ThemedText>
      <ThemedText>{"Volatile state: " + volatileValue}</ThemedText>
      <TextInput
        value={volatileValue}
        onChangeText={setVolatileValue}
        keyboardType="numeric"
        placeholder="Enter a value"
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          minWidth: 180,
        }}
      />
      <ThemedText>Last Fetch: {lastFetch || "N/A"}</ThemedText>
      <ThemedText>Status: {status}</ThemedText>
      <ThemedText>ToDo: {toDo ? JSON.stringify(toDo) : "N/A"}</ThemedText>
      <Button
        title="Simulate Request"
        onPress={() => void handleSimulateRequest()}
      />
      <Button title="Start Polling" onPress={startPolling} />
      <Button title="Stop Polling" onPress={handleStop} />
    </ThemedView>
  );
}
