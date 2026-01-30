import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/auth";
import { CartProvider } from "../contexts/cart";
import { colors } from "../lib/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: "slide_from_right",
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
