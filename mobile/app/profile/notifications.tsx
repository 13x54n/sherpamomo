import { useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

const NOTIFICATIONS_STORAGE_KEY = "sherpamomo_notifications";

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newProducts: boolean;
  deliveryAlerts: boolean;
}

const defaultSettings: NotificationSettings = {
  orderUpdates: true,
  promotions: true,
  newProducts: false,
  deliveryAlerts: true,
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load notification settings:", err);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    }
  };

  const notificationOptions = [
    {
      key: "orderUpdates" as const,
      title: "Order Updates",
      description: "Get notified when your order status changes",
      icon: "bag-outline",
    },
    {
      key: "deliveryAlerts" as const,
      title: "Delivery Alerts",
      description: "Receive alerts when your order is out for delivery",
      icon: "bicycle-outline",
    },
    {
      key: "promotions" as const,
      title: "Promotions & Offers",
      description: "Special deals, discounts, and limited-time offers",
      icon: "pricetag-outline",
    },
    {
      key: "newProducts" as const,
      title: "New Products",
      description: "Be the first to know about new menu items",
      icon: "sparkles-outline",
    },
  ];

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <View style={styles.optionsCard}>
            {notificationOptions.map((option, index) => (
              <View
                key={option.key}
                style={[
                  styles.optionRow,
                  index < notificationOptions.length - 1 && styles.optionRowBorder,
                ]}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon as any} size={22} color={colors.primary} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Switch
                  value={settings[option.key]}
                  onValueChange={(value) => updateSetting(option.key, value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Notification preferences are saved on this device. You can also manage
            notifications in your device settings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  optionsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  optionTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  optionDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
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
});
