import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; // Adjust the path as needed
import { doc, onSnapshot, getDoc,updateDoc, deleteField } from 'firebase/firestore';

const WelcomeScreen = () => {
  const route = useRoute();
  const [wishlist, setWishlist] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wishlistDoc = doc(db, 'wishlist', 'userWishlist'); // Use your actual document ID here

    // Real-time listener
    const unsubscribe = onSnapshot(wishlistDoc, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const processedData = Object.keys(data).reduce((acc, category) => {
          acc[category] = data[category];
          return acc;
        }, {});
        setWishlist(processedData);
        setLoading(false); // Data is now loaded
      } else {
        console.log('No such document!');
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching wishlist: ', error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const removeFromWishlist = async (category, item) => {
    try {
      // Update local state
      setWishlist((prevWishlist) => {
        const updatedItems = prevWishlist[category].filter((wishItem) => wishItem !== item);
        const updatedWishlist = {
          ...prevWishlist,
          [category]: updatedItems.length ? updatedItems : undefined,
        };
        return updatedWishlist;
      });

      // Update Firestore
      const wishlistDoc = doc(db, 'wishlist', 'userWishlist'); // Use your actual document ID here
      const data = await getDoc(wishlistDoc);
      const docData = data.data();

      if (docData[category]) {
        const updatedItems = docData[category].filter((wishItem) => wishItem !== item);

        if (updatedItems.length === 0) {
          // Remove the category if no items are left
          await updateDoc(wishlistDoc, {
            [category]: deleteField(),
          });
        } else {
          // Update the category with the new list
          await updateDoc(wishlistDoc, {
            [category]: updatedItems,
          });
        }
      }
    } catch (error) {
      console.error('Error removing item from wishlist: ', error);
    }
  };

  const renderCategory = (category, items) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.gridContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.wishlistItem}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromWishlist(category, item)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wishlist</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Object.keys(wishlist).length > 0 ? (
            Object.entries(wishlist).map(([category, items]) =>
              renderCategory(category, items)
            )
          ) : (
            <Text style={styles.emptyText}>No items in your wishlist.</Text>
          )}
        </ScrollView>
      )}
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
  scrollContainer: {
    flexDirection: 'column',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
