import { useState, useEffect } from "react";
import {
  ActivityIndicator,
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
import { useCart } from "../contexts/cart";
import { useAuth } from "../contexts/auth";
import { colors, spacing, borderRadius, typography } from "../lib/theme";
import { ordersApi, userApi, CreateOrderRequest } from "../lib/api";
import { Alert } from "react-native";

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    notes: "",
  });

  // Load saved profile data on mount
  useEffect(() => {
    loadSavedProfile();
  }, []);

  const loadSavedProfile = async () => {
    try {
      setLoadingProfile(true);
      const profile = await userApi.getProfile();
      setForm((prev) => ({
        ...prev,
        name: profile.name || prev.name,
        phone: profile.phone || prev.phone,
        address: profile.address || prev.address,
      }));
    } catch (err) {
      console.error("Failed to load saved profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Save profile data after successful order
  const saveProfileData = async () => {
    try {
      await userApi.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const shipping = subtotal >= 50 ? 0 : items.length > 0 ? 4.5 : 0;
  const tax = subtotal * 0.13;
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const orderData: CreateOrderRequest = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          unit: item.unit,
        })),
        customerInfo: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
        },
        paymentInfo: {
          method: "cash_on_delivery",
          status: "pending",
        },
      };

      const response = await ordersApi.create(orderData);
      
      // Save profile data for future orders
      await saveProfileData();
      
      clearCart();
      Alert.alert(
        "Order Placed!",
        `Your order #${response.orderId} has been submitted successfully.\n\nTotal: $${response.order.total.toFixed(2)}`,
        [
          { text: "View Orders", onPress: () => router.replace("/(tabs)/orders") },
          { text: "Continue Shopping", onPress: () => router.replace("/(tabs)") },
        ]
      );
    } catch (error: any) {
      console.error("Order error:", error);
      Alert.alert("Error", error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Checkout</Text>
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
          {/* Delivery Address */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => updateForm("name", v)}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  autoComplete="name"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
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
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  value={form.address}
                  onChangeText={(v) => updateForm("address", v)}
                  placeholder="123 Main St, Toronto, ON"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  autoComplete="street-address"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Delivery Notes (Optional)</Text>
                <TextInput
                  value={form.notes}
                  onChangeText={(v) => updateForm("notes", v)}
                  placeholder="Buzzer code, floor, etc."
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="cash" size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <View style={styles.paymentCard}>
              <View style={styles.paymentInfo}>
                {/* <Ionicons name="cash" size={24} color={colors.success} /> */}
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                  <Text style={styles.paymentSubtitle}>Pay when your order arrives</Text>
                </View>
              </View>
              <View style={styles.paymentBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="receipt" size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryCard}>
              {items.map((item) => (
                <View key={item.id} style={styles.summaryItem}>
                  <Text style={styles.summaryItemName}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={styles.summaryItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryLabelRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  {shipping === 0 && (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.summaryValue}>
                  {shipping === 0 ? "$0.00" : `$${shipping.toFixed(2)}`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (13%)</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.placeOrderButton,
              pressed && styles.placeOrderButtonPressed,
              (items.length === 0 || loading) && styles.placeOrderButtonDisabled,
            ]}
            onPress={placeOrder}
            disabled={items.length === 0 || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.background}
                />
                <Text style={styles.placeOrderText}>Place Order</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
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
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 44,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  paymentDetails: {
    gap: spacing.xs,
  },
  paymentTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  paymentSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  paymentBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.success}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryItemName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryItemPrice: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  freeBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.background,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primary,
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  placeOrderButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  placeOrderButtonDisabled: {
    opacity: 0.5,
  },
  placeOrderText: {
    ...typography.body,
    color: colors.background,
    fontWeight: "700",
  },
});
