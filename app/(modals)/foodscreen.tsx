import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; // Adjust the path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';

const shoeData = [
  { name: 'North Indian Food', offers: '30% off sale', category: 'Food', image: { uri: 'https://qph.cf2.quoracdn.net/main-qimg-430c19132d9e6aefb33ec9a1fc531d92-lq' } },
  { name: 'South Indian Food', offers: '20% off sale', category: 'Food', image: { uri: 'https://assets.vogue.com/photos/63d169f727f1d528635b4287/master/w_2560%2Cc_limit/GettyImages-1292563627.jpg'} },
  { name: 'Maharashtrian Food', offers: '20% off sale', category: 'Food', image: { uri: 'https://www.vegrecipesofindia.com/wp-content/uploads/2011/06/misal-pav-1v-500x500.jpg' } },
  { name: 'Italian Cuisine', offers: '10% off sale', category: 'Food', image: { uri: 'https://www.hotelmousai.com/blog/wp-content/uploads/2021/12/Top-10-Traditional-Foods-in-Italy.jpg' } },
  { name: 'Burger King', offers: '40% off sale', category: 'Food', image: { uri: 'https://b.zmtcdn.com/data/pictures/chains/5/61555/c8008523810583087401ff292c1763a3.jpg?fit=around|960:500&crop=960:500;*,*' } },
  { name: 'Chinise Cuisine', offers: '20% off sale', category: 'Food', image: { uri: 'https://assets.zeezest.com/blogs/PROD_Banner_1663162846668.jpg'}},
  { name: 'McDonalds', offers: '10% off sale', category: 'Food', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfSGd4rcJ6DPP0kypCGCrMXxbHM2WPtNpZNQ&s' } },
  { name: 'Pizza Hut', offers: 'Buy 2 @ price of 1', category: 'Food', image: { uri: 'https://media-cdn.tripadvisor.com/media/photo-s/20/9f/25/59/great-food.jpg' } },
  { name: 'Dominos', offers: 'Buy 2 tshirts @ price of 1', category: 'Food', image: { uri: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202310/untitled-1_61-sixteen_nine.jpg?size=948:533' } },
  { name: 'Juices', offers: '30% off sale', category: 'Food', image: { uri: 'https://d2wdttfod93r0n.cloudfront.net/BrandCategoryMapping/juices_0144202454234AM.png' } },
  { name: 'Sandwiches', offers: '15% off sale', category: 'Food', image: { uri: 'https://www.southernliving.com/thmb/UW4kKKL-_M3WgP7pkL6Pb6lwcgM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ham_Sandwich_011-1-49227336bc074513aaf8fdbde440eafe.jpg' } },
  { name: 'Coffee Shops', offers: '30% off sale', category: 'Food', image: { uri: 'https://img.freepik.com/free-photo/fresh-coffee-steams-wooden-table-close-up-generative-ai_188544-8923.jpg' } },
];

const ShoeScreen = () => {
  const [wishlist, setWishlist] = useState({}); // Store wishlist as an object with categories
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistDoc = doc(db, 'wishlist', 'userWishlist'); // Replace 'userWishlist' with your user identifier if needed
        const docSnap = await getDoc(wishlistDoc);

        if (docSnap.exists()) {
          setWishlist(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching wishlist: ', error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (shoe) => {
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

        // Update Firestore
        const wishlistDoc = doc(db, 'wishlist', 'userWishlist'); // Replace 'userWishlist' with your user identifier if needed
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
    <Text style={styles.Head}>Food</Text>
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
    backgroundColor: '#EAF0F7',
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