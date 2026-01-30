import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our menu, add items to your cart, and proceed to checkout. Enter your delivery details and confirm your order. You'll receive updates on your order status.",
  },
  {
    question: "What are your delivery hours?",
    answer:
      "We deliver from 11:00 AM to 9:00 PM, seven days a week. Orders placed after 9:00 PM will be processed the next day.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Go to the Orders tab to see all your orders and their current status. You'll also receive push notifications when your order status changes.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order while it's still in 'Pending' or 'Packaging' status. Go to your order details and tap 'Cancel Order'.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Currently, we only accept Cash on Delivery. More payment options coming soon!",
  },
  {
    question: "Do you offer vegetarian options?",
    answer:
      "Yes! We have a variety of vegetarian momos including vegetable momos and paneer momos. Look for the 'Vegetarian' category in our menu.",
  },
];

const contactOptions = [
  {
    icon: "call-outline",
    title: "Call Us",
    subtitle: "+1 (416) 555-0123",
    action: () => Linking.openURL("tel:+14165550123"),
  },
  {
    icon: "mail-outline",
    title: "Email Support",
    subtitle: "support@sherpamomo.com",
    action: () => Linking.openURL("mailto:support@sherpamomo.com"),
  },
  {
    icon: "logo-instagram",
    title: "Instagram",
    subtitle: "@sherpamomo",
    action: () => Linking.openURL("https://instagram.com/sherpamomo"),
  },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactCard}>
            {contactOptions.map((option, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.contactRow,
                  index < contactOptions.length - 1 && styles.contactRowBorder,
                  pressed && styles.contactRowPressed,
                ]}
                onPress={option.action}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={option.icon as any} size={22} color={colors.primary} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* FAQs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqCard}>
            {faqs.map((faq, index) => (
              <View key={index}>
                <Pressable
                  style={({ pressed }) => [
                    styles.faqQuestion,
                    pressed && styles.faqQuestionPressed,
                  ]}
                  onPress={() => toggleFaq(index)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
                {expandedFaq === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
                {index < faqs.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday - Friday</Text>
              <Text style={styles.hoursTime}>11:00 AM - 9:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Saturday - Sunday</Text>
              <Text style={styles.hoursTime}>11:00 AM - 9:00 PM</Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Sherpa Momo</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>Authentic Himalayan Dumplings</Text>
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
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  contactCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },
  contactRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactRowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  contactSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  faqQuestionPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  faqQuestionText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.md,
  },
  faqAnswer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  faqAnswerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  faqDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  hoursCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hoursDay: {
    ...typography.body,
    color: colors.textSecondary,
  },
  hoursTime: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  appInfo: {
    alignItems: "center",
    marginTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  appName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  appVersion: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  appTagline: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
