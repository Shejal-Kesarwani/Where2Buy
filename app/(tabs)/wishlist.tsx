import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const WelcomeScreen = () => {
  const route = useRoute();
  const [wishlist, setWishlist] = useState(route.params?.wishlist || []);

  useEffect(() => {
    if (route.params?.wishlist) {
      setWishlist(route.params.wishlist);
    }
  }, [route.params?.wishlist]);

  const removeFromWishlist = (item) => {
    setWishlist((prevWishlist) => prevWishlist.filter((wishItem) => wishItem !== item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wishlist</Text>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {wishlist.length > 0 ? (
          wishlist.map((item, index) => (
            <View key={index} style={styles.wishlistItem}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromWishlist(item)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No items in your wishlist.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wishlistItem: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WelcomeScreen;
