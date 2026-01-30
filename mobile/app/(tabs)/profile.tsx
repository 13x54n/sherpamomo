import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth";
import { userApi, UserProfile } from "../../lib/api";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Reload profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setProfile(data);
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      // Use auth context user as fallback
      if (user) {
        setProfile({
          id: user.id,
          name: user.name,
          phone: user.phone,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phone: string) => {
    // Format +15551234567 to (555) 123-4567
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      const area = digits.slice(1, 4);
      const prefix = digits.slice(4, 7);
      const line = digits.slice(7);
      return `(${area}) ${prefix}-${line}`;
    }
    return phone;
  };

  const menuItems = [
    {
      icon: "notifications-outline",
      label: "Notifications",
      onPress: () => router.push("/profile/notifications"),
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      onPress: () => router.push("/profile/help"),
    },
    {
      icon: "document-text-outline",
      label: "Terms of Service",
      onPress: () => Linking.openURL("https://sherpamomo.vercel.app/terms"),
    },
    {
      icon: "shield-outline",
      label: "Privacy Policy",
      onPress: () => Linking.openURL("https://sherpamomo.vercel.app/privacy"),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <Pressable
          style={({ pressed }) => [
            styles.profileCard,
            pressed && styles.profileCardPressed,
          ]}
          onPress={() => router.push("/profile/edit")}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={colors.textMuted} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {profile?.name || user?.name || "Guest User"}
                </Text>
                <Text style={styles.profilePhone}>
                  {profile?.phone
                    ? formatPhone(profile.phone)
                    : user?.phone
                    ? formatPhone(user.phone)
                    : "Add phone number"}
                </Text>
                {profile?.address ? (
                  <Text style={styles.profileAddress} numberOfLines={1}>
                    {profile.address}
                  </Text>
                ) : (
                  <Text style={styles.profileAddressEmpty}>Add delivery address</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </>
          )}
        </Pressable>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={colors.textSecondary}
                />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
        </View>

        {/* Sign Out Button */}
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutButtonPressed,
          ]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  profileCardPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  profilePhone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  profileAddress: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  profileAddressEmpty: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  menuSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuItemLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.sm,
  },
  signOutButtonPressed: {
    backgroundColor: `${colors.error}10`,
  },
  signOutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: "600",
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
