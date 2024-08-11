import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; 
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { auth } from '../(tabs)/firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

const WelcomeScreen = () => {
  const route = useRoute();
  const [wishlist, setWishlist] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setWishlist({});
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const wishlistDoc = doc(db, 'userWishlists', userId); 

    const unsubscribe = onSnapshot(wishlistDoc, (docSnap) => {
      if (docSnap.exists()) {
        setWishlist(docSnap.data() || {});
      } else {
        setWishlist({});
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const removeFromWishlist = useCallback(async (category, item) => {
    if (!userId) return;

    try {
      const wishlistDoc = doc(db, 'userWishlists', userId);
      const data = await getDoc(wishlistDoc);
      const docData = data.data();

      if (docData && docData[category]) {
        const updatedItems = docData[category].filter((wishItem) => wishItem !== item);

        if (updatedItems.length === 0) {
          await updateDoc(wishlistDoc, {
            [category]: deleteField(),
          });
        } else {
          await updateDoc(wishlistDoc, {
            [category]: updatedItems,
          });
        }

        setWishlist((prevWishlist) => {
          const updatedWishlist = { ...prevWishlist };
          if (updatedItems.length === 0) {
            delete updatedWishlist[category];
          } else {
            updatedWishlist[category] = updatedItems;
          }
          return updatedWishlist;
        });
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  }, [userId]);

  const renderCategory = useMemo(() => (category, items) => {
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
  }, [removeFromWishlist]);

  const wishlistContent = useMemo(() => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (Object.keys(wishlist).length > 0) {
      return Object.entries(wishlist).map(([category, items]) =>
        renderCategory(category, items)
      );
    } else {
      return <Text style={styles.emptyText}>No items in your wishlist.</Text>;
    }
  }, [loading, wishlist, renderCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wishlist</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {wishlistContent}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F0DC',
    padding: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2C3E50',  
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1.5,  
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#2C3E50',  
    marginBottom: 15,
    borderBottomColor: '#2C3E50',
    paddingBottom: 5,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wishlistItem: {
    backgroundColor: '#FFFFFF', 
    padding: 15,
    borderRadius: 15,  
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },  
  },
  itemText: {
    fontSize: 16,
    color: '#2C3E50',  
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#6B8A7A',  
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#FFFFFF',  
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#7F8C8D',  
    textAlign: 'center',
    marginTop: 50,
  },
});

export default WelcomeScreen;
