import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ResponsiveMasterDetail } from "@/components/responsive-master-detail";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useResponsive } from "@/hooks/use-responsive";

const dashboardItems = [
  {
    id: "layout",
    title: "Layout",
    summary: "The page stacks on small screens.",
    details:
      "On a phone, the content goes one after another. On a bigger screen, it uses two columns.",
    highlights: [
      "Works on phone and tablet",
      "Changes when the screen gets wider",
    ],
  },
  {
    id: "buttons",
    title: "Buttons",
    summary: "The buttons are easy to tap.",
    details:
      "I made the buttons a bit bigger so they are easier to use. They also have labels for screen readers.",
    highlights: ["Large enough to tap", "Has simple labels"],
  },
  {
    id: "text",
    title: "Text",
    summary: "The text should stay readable.",
    details:
      "I used simple font sizes and left enough space between lines so it does not feel cramped.",
    highlights: ["Readable text", "Works with bigger font settings"],
  },
];

export default function HomeScreen() {
  const { breakpoint } = useResponsive();
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.box} accessibilityRole="summary" accessible>
        <ThemedText type="title" accessibilityRole="header">
          My first app
        </ThemedText>
        <ThemedText>
          This is a simple app I made while learning React Native. It is not
          fancy, but it works.
        </ThemedText>
        <ThemedText>Screen size: {breakpoint}</ThemedText>
      </ThemedView>

      <ResponsiveMasterDetail
        title="What this app does"
        description="This is a basic demo of a responsive screen with a few simple sections."
        items={dashboardItems}
      />

      <ThemedView style={styles.box} accessibilityRole="summary" accessible>
        <ThemedText type="subtitle">Next step</ThemedText>
        <ThemedText>
          I added a simple button below to open the modal screen.
        </ThemedText>
        <Link href="/modal" asChild>
          <ThemedText
            type="link"
            accessibilityRole="link"
            style={styles.linkText}
          >
            Open modal
          </ThemedText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Demo Screen</ThemedText>
        <TouchableOpacity onPress={() => router.push("/demo")}>
          <ThemedText type="link">Go to Demo Screen</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Database</ThemedText>
        <TouchableOpacity onPress={() => router.push("/CrudTest")}>
          <ThemedText type="link">Open CRUD Test</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 10,
  },
  linkText: {
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  stepContainer: {
    gap: 8,
    marginTop: 12,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
