import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/auth";
import { colors, typography, spacing } from "../lib/theme";

export default function Index() {
  const { isLoading } = useAuth();

  // The AuthProvider handles redirects, so this just shows a loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/SMPFT.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Authentic Himalayan Dumplings</Text>
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  // While redirecting, show loading
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/SMPFT.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator color={colors.primary} style={styles.loader} />
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  loader: {
    marginTop: spacing.md,
  },
});
