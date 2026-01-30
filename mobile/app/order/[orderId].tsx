import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ordersApi, Order } from "../../lib/api";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

const statusConfig: Record<Order["status"], { label: string; color: string; icon: string }> = {
  pending: { label: "Pending", color: colors.textMuted, icon: "time-outline" },
  packaging: { label: "Packaging", color: colors.warning, icon: "cube-outline" },
  delivered: { label: "Delivered", color: colors.success, icon: "checkmark-done-circle-outline" },
  cancelled: { label: "Cancelled", color: colors.error, icon: "close-circle-outline" },
  completed: { label: "Completed", color: colors.success, icon: "checkmark-done-circle" },
  failed: { label: "Failed", color: colors.error, icon: "alert-circle-outline" },
};

const statusSteps = ["pending", "packaging", "delivered"];

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getOrder(orderId!);
      setOrder(data);
    } catch (err: any) {
      console.error("Failed to load order:", err);
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);
              await ordersApi.cancelOrder(orderId!);
              Alert.alert("Order Cancelled", "Your order has been cancelled.");
              loadOrder(); // Reload to get updated status
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to cancel order");
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const canCancel = order && ["pending", "packaging"].includes(order.status);
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  if (loading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorTitle}>Order not found</Text>
        <Text style={styles.errorText}>{error || "Unable to load order details"}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.backButtonLarge,
            pressed && styles.backButtonLargePressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonLargeText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order ID & Status */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{order.orderId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
            <Ionicons name={status.icon as any} size={16} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Items ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
          </Text>
          <View style={styles.itemsCard}>
            {order.items.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.orderItem,
                  index < order.items.length - 1 && styles.orderItemBorder,
                ]}
              >
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* Status Timeline (for active orders) */}
        {!["cancelled", "failed", "completed"].includes(order.status) && (
          <View style={styles.section}>
            <View style={styles.timelineCard}>
              {statusSteps.map((step, index) => {
                const stepStatus = statusConfig[step as Order["status"]];
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;
                const isLast = index === statusSteps.length - 1;

                return (
                  <View key={step} style={styles.timelineRow}>
                    {/* Left: Icon and Line */}
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineIcon,
                          isCompleted && styles.timelineIconCompleted,
                          isCurrent && styles.timelineIconCurrent,
                          isPending && styles.timelineIconPending,
                        ]}
                      >
                        {isCompleted ? (
                          <Ionicons name="checkmark" size={16} color={colors.background} />
                        ) : (
                          <Ionicons
                            name={stepStatus.icon as any}
                            size={16}
                            color={isCurrent ? colors.primary : colors.textMuted}
                          />
                        )}
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            isCompleted && styles.timelineLineCompleted,
                          ]}
                        />
                      )}
                    </View>

                    {/* Right: Content */}
                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineLabel,
                          isCompleted && styles.timelineLabelCompleted,
                          isCurrent && styles.timelineLabelCurrent,
                          isPending && styles.timelineLabelPending,
                        ]}
                      >
                        {stepStatus.label}
                      </Text>
                      {isCurrent && (
                        <Text style={styles.timelineSubtext}>In progress</Text>
                      )}
                      {isCompleted && (
                        <Text style={styles.timelineSubtext}>Completed</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}



        {/* Delivery Info */}
        {order.customerInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={18} color={colors.textMuted} />
                <Text style={styles.infoText}>{order.customerInfo.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color={colors.textMuted} />
                <Text style={styles.infoText}>{order.customerInfo.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color={colors.textMuted} />
                <Text style={styles.infoText}>{order.customerInfo.address}</Text>
              </View>
              {order.customerInfo.notes && (
                <View style={styles.infoRow}>
                  <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
                  <Text style={styles.infoText}>{order.customerInfo.notes}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color={colors.textMuted} />
              <Text style={styles.infoText}>
                {order.paymentInfo?.method === "cash_on_delivery" || order.paymentInfo?.method === "cash"
                  ? "Cash on Delivery"
                  : order.paymentInfo?.method || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {canCancel && (
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
              cancelling && styles.cancelButtonDisabled,
            ]}
            onPress={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color={colors.error} />
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
              </>
            )}
          </Pressable>
        )}
      </ScrollView>
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
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  backButtonLarge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonLargePressed: {
    backgroundColor: colors.surfaceElevated,
  },
  backButtonLargeText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
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
  orderHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.md,
  },
  orderId: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusText: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  orderDate: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingBottom: 0,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 40,
  },
  timelineLeft: {
    alignItems: "center",
    width: 40,
  },
  timelineIcon: {
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineIconCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  timelineIconCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineIconPending: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.md,
  },
  timelineLabel: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: "500",
  },
  timelineLabelCompleted: {
    color: colors.textSecondary,
  },
  timelineLabelCurrent: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  timelineLabelPending: {
    color: colors.textMuted,
  },
  timelineSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  itemsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  itemQuantity: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  itemPrice: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
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
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButtonPressed: {
    backgroundColor: `${colors.error}10`,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.error,
    fontWeight: "600",
  },
});
