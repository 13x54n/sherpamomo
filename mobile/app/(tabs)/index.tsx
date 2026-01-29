import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { products } from "../../lib/data";
import { useCart } from "../../contexts/cart";
import { useAuth } from "../../contexts/auth";
import { colors, spacing, borderRadius, typography } from "../../lib/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addItem } = useCart();
  const { signOut } = useAuth();

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoSmall}>
            <Ionicons name="restaurant" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.brand}>Sherpa Momo</Text>
          </View>
        </View>
        <Pressable
          onPress={signOut}
          style={({ pressed }) => [
            styles.profileButton,
            pressed && styles.profileButtonPressed,
          ]}
        >
          <Ionicons name="person" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Fresh Momos</Text>
          <Text style={styles.heroSubtitle}>
            Handcrafted with love, delivered hot
          </Text>
          <View style={styles.heroTag}>
            <Ionicons name="bicycle" size={14} color={colors.primary} />
            <Text style={styles.heroTagText}>Free delivery over $50</Text>
          </View>
        </View>
        <View style={styles.heroImageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80",
            }}
            style={styles.heroImage}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item, index }) => (
            <Pressable
              style={({ pressed }) => [
                styles.categoryChip,
                index === 0 && styles.categoryChipActive,
                pressed && styles.categoryChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Products */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/product/${item.id}`)}
            style={({ pressed }) => [
              styles.productCard,
              pressed && styles.productCardPressed,
            ]}
          >
            <View style={styles.productImageContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  addItem(item);
                }}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
              >
                <Ionicons name="add" size={20} color={colors.background} />
              </Pressable>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color={colors.primary} />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logoSmall: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  brand: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  heroBanner: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  heroTagText: {
    ...typography.caption,
    color: colors.primary,
  },
  heroImageContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginLeft: spacing.md,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  categoriesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  categoriesList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipPressed: {
    opacity: 0.8,
  },
  categoryText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: colors.background,
  },
  productsSection: {
    marginBottom: spacing.sm,
  },
  productsList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  productCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  productCardPressed: {
    opacity: 0.9,
  },
  productImageContainer: {
    position: "relative",
    aspectRatio: 1,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  productInfo: {
    padding: spacing.md,
  },
  productCategory: {
    ...typography.caption,
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
