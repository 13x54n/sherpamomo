import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth";
import { API_BASE_URL } from "../../lib/api";
import { colors, spacing, typography } from "../../lib/theme";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const params = useLocalSearchParams<{ code?: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.code;
    if (!code || typeof code !== "string") {
      setError("Missing code");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/mobile/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;
        if (!res.ok) {
          setError(data.message || "Sign-in failed");
          return;
        }

        await signIn(data.token, {
          id: data.user.id,
          phone: data.user.phone ?? "",
          name: data.user.name ?? undefined,
        });
        router.replace("/(tabs)");
      } catch (e) {
        if (!cancelled) setError("Network error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.code]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.hint}>Close and try signing in again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.label}>Completing sign-in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: "center",
  },
});
