import { Breakpoint } from "@/types/breakpoint";
import { Dimensions, useWindowDimensions } from "react-native";

export function useResponsive() {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

  const width = screenWidth || windowWidth;
  const height = screenHeight || windowHeight;

  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const isLandscape = width > height;
  const showSplitView = isTablet || isDesktop;

  let breakpoint: Breakpoint = "Phone";
  if (isTablet) {
    breakpoint = "Tablet";
  }
  if (isDesktop) {
    breakpoint = "Desktop";
  }

  return {
    screenWidth: width,
    screenHeight: height,
    isTablet,
    isDesktop,
    isLandscape,
    showSplitView,
    breakpoint,
  };
}
