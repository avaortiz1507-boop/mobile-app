import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useResponsive } from "@/hooks/use-responsive";

export default function TabTwoScreen() {
  const { breakpoint, isLandscape } = useResponsive();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer} accessible={false}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}
          accessibilityRole="header"
        >
          Explore
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.box} accessibilityRole="summary" accessible>
        <ThemedText>
          This page is just a simple test of the layout and the buttons.
        </ThemedText>
        <ThemedText>
          Current size: {breakpoint}. Orientation:{" "}
          {isLandscape ? "landscape" : "portrait"}.
        </ThemedText>
      </ThemedView>

      <Collapsible title="Layout" accessibilityLabel="Layout information">
        <ThemedText>
          On a small screen, everything goes in one column. On a bigger screen,
          it can spread out.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Buttons" accessibilityLabel="Button information">
        <ThemedText>
          I made the buttons bigger and gave them clear labels so they are
          easier to use.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Text" accessibilityLabel="Text information">
        <ThemedText>
          The text is simple and the spacing is okay for reading.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  box: {
    gap: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 10,
    marginBottom: 10,
  },
});
