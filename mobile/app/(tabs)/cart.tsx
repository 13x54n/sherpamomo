import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../contexts/cart";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = subtotal >= 50 ? 0 : items.length > 0 ? 4.5 : 0;
  const tax = subtotal * 0.13; // 13% tax
  const total = subtotal + shipping + tax;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.itemCount}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="bag-outline" size={64} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our menu and add some delicious momos
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.browseButton,
              pressed && styles.browseButtonPressed,
            ]}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.itemsList}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Pressable
                      onPress={() => removeItem(item.id)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  </View>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                    <View style={styles.quantityControls}>
                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={({ pressed }) => [
                          styles.qtyButton,
                          pressed && styles.qtyButtonPressed,
                        ]}
                      >
                        <Ionicons
                          name="remove"
                          size={16}
                          color={colors.textPrimary}
                        />
                      </Pressable>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={({ pressed }) => [
                          styles.qtyButton,
                          styles.qtyButtonAdd,
                          pressed && styles.qtyButtonPressed,
                        ]}
                      >
                        <Ionicons
                          name="add"
                          size={16}
                          color={colors.background}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Promo Code */}
            <View style={styles.promoSection}>
              <View style={styles.promoInput}>
                <Ionicons name="pricetag" size={18} color={colors.textMuted} />
                <Text style={styles.promoPlaceholder}>Add promo code</Text>
              </View>
              <Pressable style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Apply</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
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

            <Pressable
              style={({ pressed }) => [
                styles.checkoutButton,
                pressed && styles.checkoutButtonPressed,
              ]}
              onPress={() => router.push("/checkout")}
            >
              <Text style={styles.checkoutButtonText}>
                Proceed to Checkout
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={colors.background}
              />
            </Pressable>
          </View>
        </>
      )}
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
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  itemCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  browseButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  browseButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  browseButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  itemsList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.sm,
  },
  itemCategory: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  itemPrice: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyButtonAdd: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qtyButtonPressed: {
    opacity: 0.8,
  },
  qtyText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  promoSection: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  promoInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  promoPlaceholder: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  promoButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promoButtonText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primary,
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  checkoutButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  checkoutButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: "700",
  },
});
