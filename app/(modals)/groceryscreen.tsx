import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../(tabs)/firebaseConfig'; 
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const shoeData = [
  { name: 'Vegetables', offers: '30% off sale', category: 'Grocery', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4vbJ9J2erGuOudV0SOEXJbQKskLEP--WhsQ&s' } },
  { name: 'Fruits', offers: '20% off sale', category: 'Grocery', image: { uri: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202312/6-fruits-to-eat-on-empty-stomach-053937965-1x1.jpg?VersionId=xIXuT3WPQa4V8dHjQllmefHlDH1mfNDw' } },
  { name: 'Bread', offers: '20% off sale', category: 'Grocery', image: { uri: 'https://tastesbetterfromscratch.com/wp-content/uploads/2020/03/Bread-Recipe-5-2.jpg' } },
  { name: 'Beverages', offers: '10% off sale', category: 'Grocery', image: { uri: 'https://thumbs.dreamstime.com/b/cans-beverages-19492376.jpg' } },
  { name: 'Milk', offers: '40% off sale', category: 'Grocery', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPw0DWZerMJ7q5g3IRUqZRn6jPjVQfrJ3dxQ&s' } },
  { name: 'Cheese', offers: '20% off sale', category: 'Grocery', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhhm4yZhLinbQJR8wRsYmBgtdE9K0nSyvsaA&s' } },
  { name: 'Frozen Foods', offers: '10% off sale', category: 'Grocery', image: { uri: 'https://content.jdmagicbox.com/comp/raipur-chhattisgarh/k2/9999px771.x771.220922015412.r5k2/catalogue/goeld-frozen-food-raipur-chhattisgarh-frozen-food-product-retailers-493f7gfkoc-250.jpg' } },
  { name: 'Snacks', offers: 'Buy 2 @ price of 1', category: 'Grocery', image: { uri: 'https://m.media-amazon.com/images/I/81ZX-dvnU1L.jpg' } },
  { name: 'Cookware', offers: 'Buy 2 tshirts @ price of 1', category: 'Grocery', image: { uri: 'https://vinodcookware.com/cdn/shop/products/1m0a6208.jpg?v=1645848884' } },
  { name: 'Cleaning Supplies', offers: '30% off sale', category: 'Grocery', image: { uri: 'https://m.media-amazon.com/images/I/61R2fPIJM0L.jpg' } },
  { name: 'Dry Fruits', offers: '15% off sale', category: 'Grocery', image: { uri: 'https://farmfreshbangalore.com/cdn/shop/files/GiftBox.jpg?v=1696940603' } },
  { name: 'Spices', offers: '30% off sale', category: 'Grocery', image: { uri: 'https://thewholesaler.in/cdn/shop/products/thewholesalerco-IndianVegRecipeSpices-Essential-kitchen-masala-pack.jpg?v=1671605208' } },

];

const ShoeScreen = () => {
  const [wishlist, setWishlist] = useState({});
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
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
    });

    return () => unsubscribe();
  }, [userId]);

  const toggleWishlist = async (shoe) => {
    if (!userId) return;

    try {
      setWishlist((prevWishlist) => {
        const category = shoe.category;
        const itemsInCategory = prevWishlist[category] || [];

        const updatedWishlist = itemsInCategory.includes(shoe.name)
          ? {
              ...prevWishlist,
              [category]: itemsInCategory.filter((item) => item !== shoe.name),
            }
          : {
              ...prevWishlist,
              [category]: [...itemsInCategory, shoe.name],
            };

      
        const wishlistDoc = doc(db, 'userWishlists', userId); 
        setDoc(wishlistDoc, updatedWishlist);

        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error updating wishlist: ', error);
    }
  };

  const openMap = (shoe) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${shoe.name}+store+near+me`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Head}>Grocery</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {shoeData.map((shoe, index) => (
          <View key={index} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openMap(shoe)}
            >
              <Image source={shoe.image} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{shoe.name}</Text>
              <Text style={styles.buttonText}>{shoe.offers}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.heartIcon,
                wishlist[shoe.category]?.includes(shoe.name) && styles.heartIconActive,
              ]}
              onPress={() => toggleWishlist(shoe)}
            >
              <Text style={styles.heartText}>
                {wishlist[shoe.category]?.includes(shoe.name) ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={() => navigation.navigate('wishlist')}
      >
        <Text style={styles.wishlistButtonText}>Go to Wishlist</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B0C4DE',
    marginTop: 40,
  },
  Head:{
    padding: 15,
    backgroundColor: '#1F4E79',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight:'bold'
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  buttonContainer: {
    width: '40%',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1F4E79',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonIcon: {
    width: 100,
    height: 90,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  heartIconActive: {
    color: 'red',
  },
  heartText: {
    fontSize: 20,
  },
  wishlistButton: {
    padding: 15,
    backgroundColor: '#1F4E79',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonText: {

    color: '#fff',
    fontSize: 20,
  },
});

export default ShoeScreen;
