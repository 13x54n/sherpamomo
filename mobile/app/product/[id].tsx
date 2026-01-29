import { useState } from "react";
import {
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
import { products } from "../../lib/data";
import { useCart } from "../../contexts/cart";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

export default function ProductScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle" size={64} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Product not found</Text>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    router.push("/(tabs)/cart");
  };

  return (
    <View style={styles.container}>
      {/* Product Image with Header */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      {/* Product Details */}
      <ScrollView
        style={styles.detailsContainer}
        contentContainerStyle={styles.detailsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* Title & Price */}
        <View style={styles.titleRow}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= 4 ? "star" : "star-half"}
                size={16}
                color={colors.primary}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>4.8 (128 reviews)</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {["Organic flour", "Fresh vegetables", "Herbs & spices", "Love"].map(
              (ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.success}
                  />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Nutrition Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Info</Text>
          <View style={styles.nutritionGrid}>
            {[
              { label: "Calories", value: "320" },
              { label: "Protein", value: "18g" },
              { label: "Carbs", value: "42g" },
              { label: "Fat", value: "8g" },
            ].map((item, index) => (
              <View key={index} style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.value}</Text>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.lg }]}>
        {/* Quantity Selector */}
        <View style={styles.quantitySelector}>
          <Pressable
            style={({ pressed }) => [
              styles.qtyButton,
              pressed && styles.qtyButtonPressed,
            ]}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.qtyText}>{quantity}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.qtyButton,
              styles.qtyButtonAdd,
              pressed && styles.qtyButtonPressed,
            ]}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={colors.background} />
          </Pressable>
        </View>

        {/* Add to Cart Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addToCartButton,
            pressed && styles.addToCartButtonPressed,
          ]}
          onPress={handleAddToCart}
        >
          <Ionicons name="bag-add" size={20} color={colors.background} />
          <Text style={styles.addToCartText}>
            Add to Cart · ${(product.price * quantity).toFixed(2)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  backButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  backButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  imageContainer: {
    height: 320,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(10, 10, 10, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  headerButtonPressed: {
    backgroundColor: "rgba(10, 10, 10, 0.8)",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: -borderRadius.xl,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  detailsContent: {
    padding: spacing.xl,
    paddingBottom: 120,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  productName: {
    ...typography.h1,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  productPrice: {
    ...typography.h2,
    color: colors.primary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  ingredientsList: {
    gap: spacing.sm,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  ingredientText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutritionItem: {
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  nutritionValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  nutritionLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
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
    ...typography.h3,
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: "center",
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  addToCartButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  addToCartText: {
    ...typography.body,
    color: colors.background,
    fontWeight: "700",
  },
});
