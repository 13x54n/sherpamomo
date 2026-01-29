import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/auth";
import { colors, typography } from "../lib/theme";

export default function Index() {
  const { isLoading } = useAuth();

  // The AuthProvider handles redirects, so this just shows a loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Ionicons name="restaurant" size={48} color={colors.primary} />
        </View>
        <Text style={styles.brand}>Sherpa Momo</Text>
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  // While redirecting, show loading
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brand: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  loader: {
    marginTop: 8,
  },
});
