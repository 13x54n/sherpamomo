import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../lib/theme";
import { useAuth } from "../contexts/auth";
import { API_BASE_URL } from "../lib/api";

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL || "https://sherpamomo.vercel.app";
const REDIRECT_URI = "sherpamomo://auth/callback";
const GOOGLE_SIGNIN_URL =
  `${WEB_APP_URL}/signin?mobile=1&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

function getCodeFromRedirectUrl(url: string): string | null {
  const match = url.match(/[?&]code=([^&]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

// Normalize Canadian phone numbers
const normalizePhoneNumber = (rawPhone: string): string | null => {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
};

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        GOOGLE_SIGNIN_URL,
        REDIRECT_URI
      );

      if (result.type !== "success" || !result.url) {
        if (result.type === "cancel" || result.type === "dismiss") {
          // User closed the in-app browser
          return;
        }
        setError("Sign-in was cancelled.");
        return;
      }

      const authCode = getCodeFromRedirectUrl(result.url);
      if (!authCode) {
        setError("Could not complete sign-in. Please try again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/mobile/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: authCode }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Sign-in failed.");
        return;
      }

      await signIn(data.token, {
        id: data.user.id,
        phone: data.user.phone ?? "",
        name: data.user.name ?? undefined,
      });
      // Auth context will redirect to tabs
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const requestCode = async () => {
    setError(null);
    const normalized = normalizePhoneNumber(phone);
    if (!normalized) {
      setError("Enter a valid Canadian phone number (ex: 416-555-1234).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send code");
      }

      // In dev mode, the code might be returned
      if (data.devCode) {
        console.log("Dev verification code:", data.devCode);
      }

      setStep("code");
    } catch (err: any) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError(null);
    const normalized = normalizePhoneNumber(phone);
    if (!normalized) {
      setError("Invalid phone number.");
      setStep("phone");
      return;
    }
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Sign in with the token and user data
      await signIn(data.token, {
        id: data.user.id,
        phone: data.user.phone,
        name: data.user.name,
      });

      // Auth context will handle redirect
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("phone");
    setCode("");
    setError(null);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require("../assets/images/SMPFT.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* <Text style={styles.tagline}>Authentic Himalayan Taste Delivered</Text> */}
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.title}>
            {step === "phone" ? "Welcome" : "Verify"}
          </Text>
          <Text style={styles.subtitle}>
            {step === "phone"
              ? "Enter your phone number to get started."
              : "Enter the OTP to verify your account."}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {step === "phone" ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>+1</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(416) 555-1234"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  style={styles.input}
                  autoComplete="tel"
                />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={requestCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Continue</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={colors.background}
                    />
                  </>
                )}
              </Pressable>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.googleButton,
                  pressed && styles.googleButtonPressed,
                  googleLoading && styles.googleButtonDisabled,
                ]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                ) : (
                  <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
                )}
                <Text style={styles.googleButtonText}>
                  {googleLoading ? "Signing in…" : "Sign in with Google"}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.codeInputContainer}>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  style={styles.codeInput}
                  maxLength={6}
                  textAlign="center"
                />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={verifyCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify</Text>
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.background}
                    />
                  </>
                )}
              </Pressable>
              <Pressable
                style={styles.backButton}
                onPress={resetFlow}
                disabled={loading}
              >
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text style={styles.backButtonText}>Change number</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our <Text style={styles.footerLink}>Terms of Service</Text> and <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  formSection: {
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  inputPrefix: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  codeInputContainer: {
    marginBottom: spacing.lg,
  },
  codeInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: "700",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  backButtonText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  googleButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    // textAlign: "center",
  },
  footerLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
