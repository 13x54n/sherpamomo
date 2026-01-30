import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth";
import { userApi, UserProfile } from "../../lib/api";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await userApi.getProfile();
      setForm({
        name: profile.name || user?.name || "",
        phone: profile.phone || user?.phone || "",
        address: profile.address || "",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
      // Use auth user data as defaults
      setForm({
        name: user?.name || "",
        phone: user?.phone || "",
        address: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!form.name.trim()) {
      Alert.alert("Required", "Please enter your name");
      return;
    }

    setSaving(true);
    try {
      await userApi.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      Alert.alert("Success", "Profile saved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      Alert.alert("Error", err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.textMuted} />
            </View>
            <Text style={styles.avatarHint}>Profile photo coming soon</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} />
                <TextInput
                  value={form.name}
                  onChangeText={(v) => updateForm("name", v)}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  autoComplete="name"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={colors.textMuted} />
                <TextInput
                  value={form.phone}
                  onChangeText={(v) => updateForm("phone", v)}
                  placeholder="(416) 555-1234"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
              <Text style={styles.inputHint}>
                Used for delivery updates and order confirmations
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.textAreaIcon}
                />
                <TextInput
                  value={form.address}
                  onChangeText={(v) => updateForm("address", v)}
                  placeholder="123 Main St, Apt 4B&#10;Toronto, ON M5V 1A1"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              <Text style={styles.inputHint}>
                This will be pre-filled at checkout
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={styles.infoText}>
              Your profile information is saved to your account and will be used to
              speed up checkout.
            </Text>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
              saving && styles.saveButtonDisabled,
            ]}
            onPress={saveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color={colors.background} />
                <Text style={styles.saveButtonText}>Save Profile</Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  formSection: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: spacing.md,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  textArea: {
    minHeight: 80,
    paddingVertical: 0,
  },
  inputHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${colors.info}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: "700",
  },
});
