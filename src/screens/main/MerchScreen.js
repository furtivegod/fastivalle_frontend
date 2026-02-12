import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MerchScreen = () => {
  const theme = useTheme();

  const products = [
    {
      id: 1,
      name: 'Fastivalle T-Shirt',
      price: 29.99,
      image: null,
      category: 'Apparel',
      inStock: true,
    },
    {
      id: 2,
      name: 'Festival Hoodie',
      price: 49.99,
      image: null,
      category: 'Apparel',
      inStock: true,
    },
    {
      id: 3,
      name: 'Logo Cap',
      price: 19.99,
      image: null,
      category: 'Accessories',
      inStock: false,
    },
    {
      id: 4,
      name: 'Festival Poster',
      price: 14.99,
      image: null,
      category: 'Accessories',
      inStock: true,
    },
    {
      id: 5,
      name: 'Water Bottle',
      price: 12.99,
      image: null,
      category: 'Accessories',
      inStock: true,
    },
    {
      id: 6,
      name: 'Tote Bag',
      price: 15.99,
      image: null,
      category: 'Accessories',
      inStock: true,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Festival Merchandise
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Show your festival spirit
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.filterButtonText, { color: theme.colors.background }]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>
            Apparel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>
            Accessories
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productsGrid}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.productCard, { backgroundColor: theme.colors.surface }]}
          >
            <View style={[styles.productImage, { backgroundColor: theme.colors.border }]}>
              {product.image ? (
                <Image source={{ uri: product.image }} style={styles.image} />
              ) : (
                <Ionicons name="shirt-outline" size={48} color={theme.colors.textSecondary} />
              )}
              {!product.inStock && (
                <View style={[styles.outOfStockBadge, { backgroundColor: theme.colors.error }]}>
                  <Text style={[styles.outOfStockText, { color: theme.colors.background }]}>
                    Out of Stock
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productCategory, { color: theme.colors.textSecondary }]}>
                {product.category}
              </Text>
              <Text style={[styles.productName, { color: theme.colors.text }]}>
                {product.name}
              </Text>
              <View style={styles.productFooter}>
                <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addToCartButton,
                    {
                      backgroundColor: product.inStock
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}
                  disabled={!product.inStock}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={theme.colors.background}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MerchScreen;
