import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
  StatusBar,
  ListRenderItem,
} from 'react-native';

const { width } = Dimensions.get('window');

// Helper function to format INR prices
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// TypeScript interfaces
interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  specifications?: { [key: string]: string };
}

interface RelatedProduct {
  id: number;
  title: string;
  price: number;
  image: string;
}

// Mock data for the main product (converted to INR)
const mainProduct: Product = {
  id: 1,
  title: 'AirPods Pro Max - Studio Quality',
  price: 549.99 * 83.5, // Convert USD to INR
  originalPrice: 699.99 * 83.5,
  image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center&auto=format&q=80',
  rating: 4.8,
  reviews: 2847,
  description: 'Professional studio-grade wireless headphones with computational audio technology. Designed for creators, audiophiles, and professionals who demand the highest quality sound experience.',
  features: [
    'Computational Audio with H1 chip',
    'Active Noise Cancellation with Transparency mode', 
    '20-hour battery life with ANC',
    'Memory foam ear cushions with breathable knit mesh',
    'Digital Crown for precise volume control',
    'Spatial audio with dynamic head tracking',
    'Premium aluminum and stainless steel construction'
  ],
  specifications: {
    'Driver Size': '40mm custom dynamic drivers',
    'Frequency Range': '20Hz - 20kHz',
    'Impedance': '32Ω',
    'Weight': '384.8g',
    'Connectivity': 'Bluetooth 5.0, Lightning to 3.5mm cable',
    'Chip': 'Apple H1 headphone chip',
    'Battery': '20 hours (ANC on), 5 min charge = 1.5 hours',
    'Colors': 'Space Gray, Silver, Sky Blue, Pink, Green'
  }
};

// Mock data for related products (converted to INR)
const relatedProducts: RelatedProduct[] = [
  {
    id: 2,
    title: 'AirPods Pro (2nd Gen)',
    price: 249.99 * 83.5,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop&crop=center&auto=format&q=80'
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5',
    price: 399.99 * 83.5,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&crop=center&auto=format&q=80'
  },
  {
    id: 4,
    title: 'Bose QuietComfort 45',
    price: 329.99 * 83.5,
    image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&h=300&fit=crop&crop=center&auto=format&q=80'
  },
  {
    id: 5,
    title: 'Sennheiser Momentum 4',
    price: 379.99 * 83.5,
    image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=300&h=300&fit=crop&crop=center&auto=format&q=80'
  },
];

const ProductDetailsApp: React.FC = () => {
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const handleAddToCart = (): void => {
    setIsAddedToCart(true);
    setCartItems([...cartItems, mainProduct]);
    
    Alert.alert(
      'Added to Cart!',
      `${mainProduct.title} has been added to your cart.`,
      [
        {
          text: 'Continue Shopping',
          style: 'cancel'
        },
        {
          text: 'View Cart',
          onPress: () => navigateToCart()
        }
      ]
    );

    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const navigateToCart = (): void => {
    const total = (cartItems.length + 1) * mainProduct.price;
    Alert.alert(
      'Cart Page',
      `You have ${cartItems.length + 1} item(s) in your cart.\n\nTotal: ${formatINR(total)}`,
      [{ text: 'OK' }]
    );
  };

  const toggleSection = (section: string): void => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderRelatedProduct: ListRenderItem<RelatedProduct> = ({ item }) => (
    <TouchableOpacity style={styles.relatedProductItem}>
      <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.relatedProductPrice}>{formatINR(item.price)}</Text>
    </TouchableOpacity>
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, { color: i <= rating ? '#FFD700' : '#DDD' }]}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: mainProduct.image }} style={styles.productImage} />
            <View style={styles.imageBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{mainProduct.title}</Text>
          
          {mainProduct.rating && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(mainProduct.rating)}
              </View>
              <Text style={styles.ratingText}>
                {mainProduct.rating} ({mainProduct.reviews?.toLocaleString()} reviews)
              </Text>
            </View>
          )}

          {/* Price in INR */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{formatINR(mainProduct.price)}</Text>
            {mainProduct.originalPrice && (
              <>
                <Text style={styles.originalPrice}>{formatINR(mainProduct.originalPrice)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>21% OFF</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.stockContainer}>
            <View style={styles.stockDot} />
            <Text style={styles.stockText}>In Stock - Ready to Ship</Text>
            <Text style={styles.shippingText}>FREE shipping on orders over ₹4,000</Text>
          </View>

          {mainProduct.description && (
            <Text style={styles.description}>{mainProduct.description}</Text>
          )}
        </View>

        {/* Features Section */}
        {mainProduct.features && (
          <View style={styles.expandableSections}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('features')}
            >
              <Text style={styles.sectionTitle}>Features</Text>
              <Text style={styles.expandIcon}>
                {expandedSection === 'features' ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            {expandedSection === 'features' && (
              <View style={styles.sectionContent}>
                {mainProduct.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Related Products */}
        <View style={styles.relatedProductsSection}>
          <Text style={styles.relatedProductsTitle}>You May Also Like</Text>
          <FlatList
            data={relatedProducts}
            renderItem={renderRelatedProduct}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedProductsList}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isAddedToCart && styles.addToCartButtonSuccess
          ]}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartButtonText}>
            {isAddedToCart ? '✓ Added to Cart!' : `Add to Cart - ${formatINR(mainProduct.price)}`}
          </Text>
        </TouchableOpacity>
        
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.viewCartButton} onPress={navigateToCart}>
            <Text style={styles.viewCartButtonText}>
              View Cart ({cartItems.length}) - {formatINR(cartItems.length * mainProduct.price)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  heartButton: {
    padding: 8,
  },
  heartButtonText: {
    fontSize: 24,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  productImage: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 20,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  imageBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  imageZoomButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomIcon: {
    fontSize: 16,
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2c3e50',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 20,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 26,
    marginTop: 15,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27ae60',
    marginRight: 8,
  },
  stockText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
    marginRight: 15,
  },
  shippingText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
  },
  expandableSections: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: '300',
    color: '#666',
  },
  sectionContent: {
    paddingVertical: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: '#e74c3c',
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  specKey: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#666',
  },
  relatedProductsSection: {
    paddingVertical: 20,
  },
  relatedProductsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  relatedProductsList: {
    paddingLeft: 20,
  },
  relatedProductItem: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedProductImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  relatedProductTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartButtonSuccess: {
    backgroundColor: '#27ae60',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  viewCartButton: {
    backgroundColor: '#34495e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProductDetailsApp;