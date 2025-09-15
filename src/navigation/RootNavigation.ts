// src/navigation/RootNavigation.ts
import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./AppNavigator";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T]
) {
  if (navigationRef.isReady()) {
    // Use type assertion with the correct signature
    (navigationRef.navigate as any)(name, params);
  }
}