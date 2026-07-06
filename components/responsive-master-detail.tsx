import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useResponsive } from "@/hooks/use-responsive";

export type MasterDetailItem = {
  id: string;
  title: string;
  summary: string;
  details: string;
  highlights?: string[];
};

type ResponsiveMasterDetailProps = {
  title: string;
  description: string;
  items: MasterDetailItem[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
};

export function ResponsiveMasterDetail({
  title,
  description,
  items,
  emptyStateTitle = "No details available",
  emptyStateDescription = "Pick an item to see more information.",
}: ResponsiveMasterDetailProps) {
  const { showSplitView } = useResponsive();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [activeId, items],
  );

  useEffect(() => {
    if (!items.length) {
      setActiveId("");
      return;
    }

    if (!items.some((item) => item.id === activeId)) {
      setActiveId(items[0].id);
    }
  }, [activeId, items]);

  return (
    <ThemedView style={styles.container} accessible={false}>
      <ThemedView style={styles.header} accessible={false}>
        <ThemedText type="subtitle" accessibilityRole="header">
          {title}
        </ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.content, showSplitView && styles.contentSplit]}
        accessible={false}
      >
        <ThemedView
          style={styles.masterPane}
          accessibilityRole="navigation"
          accessible
        >
          {items.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setActiveId(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title}`}
                accessibilityHint={`Shows the detail view for ${item.title}`}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
              >
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.optionSummary}>
                  {item.summary}
                </ThemedText>
              </Pressable>
            );
          })}
        </ThemedView>

        <ThemedView
          style={styles.detailPane}
          accessibilityRole="summary"
          accessibilityLabel={
            activeItem ? `${activeItem.title} details` : "Details panel"
          }
          accessible
        >
          {activeItem ? (
            <>
              <ThemedText type="defaultSemiBold">{activeItem.title}</ThemedText>
              <ThemedText style={styles.detailBody}>
                {activeItem.details}
              </ThemedText>
              {activeItem.highlights?.length ? (
                <ThemedView style={styles.highlightList} accessible={false}>
                  {activeItem.highlights.map((highlight) => (
                    <ThemedText key={highlight} style={styles.highlightItem}>
                      • {highlight}
                    </ThemedText>
                  ))}
                </ThemedView>
              ) : null}
            </>
          ) : (
            <>
              <ThemedText type="defaultSemiBold">{emptyStateTitle}</ThemedText>
              <ThemedText style={styles.detailBody}>
                {emptyStateDescription}
              </ThemedText>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    gap: 4,
  },
  description: {
    maxWidth: 760,
  },
  content: {
    gap: 12,
  },
  contentSplit: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  masterPane: {
    flex: 1,
    minWidth: 220,
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 10,
  },
  optionButton: {
    minHeight: 48,
    minWidth: 44,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 8,
  },
  optionButtonSelected: {
    borderColor: "#0a7ea4",
    backgroundColor: "#eef7fa",
  },
  optionSummary: {
    lineHeight: 20,
  },
  detailPane: {
    flex: 1.2,
    minWidth: 240,
    padding: 12,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 10,
    gap: 8,
  },
  detailBody: {
    lineHeight: 22,
  },
  highlightList: {
    gap: 4,
  },
  highlightItem: {
    lineHeight: 20,
  },
});
