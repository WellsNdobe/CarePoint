import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Check if we're on an auth-related route (e.g., "/auth/login")
  const isAuthRoute = segments[0]?.toLowerCase() === "auth";

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {isLoading && !isAuthRoute && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <ActivityIndicator size="large" color="#190482" />
        </View>
      )}
    </View>
  );
}
