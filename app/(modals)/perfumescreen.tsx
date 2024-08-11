import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../(tabs)/firebaseConfig'; 
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const shoeData = [
  { name: 'Wild Stone', offers: '30% off sale', category: 'Perfumes', image: { uri: 'https://m.media-amazon.com/images/I/51M73SOIdhL._AC_UF1000,1000_QL80_.jpg' } },
  { name: 'Axe', offers: '20% off sale', category: 'Perfumes', image: { uri: 'https://assets.unileversolutions.com/v1/36023848.png' } },
  { name: 'Park Avenue', offers: '20% off sale', category: 'Perfumes', image: { uri: 'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/16687124/2024/4/1/c177d021-6e5f-41c6-80cf-855de8e64ec01711967360835-Park-Avenue-Harmony-Eau-De-Parfum---100-ml-7351711967360364-1.jpg' } },
  { name: 'Chanel Perfumes', offers: '10% off sale', category: 'Perfumes', image: { uri: 'https://5.imimg.com/data5/SELLER/Default/2021/6/WE/KT/TM/126432253/5fc74f3e-3b15-4f06-9e79-a8270af18656.jpg' } },
  { name: 'Skinn By Titan', offers: '40% off sale', category: 'Perfumes', image: { uri: 'https://m.media-amazon.com/images/I/61yPezKr0zL._AC_UF1000,1000_QL80_.jpg' } },
  { name: 'Zudio Perfumes', offers: '20% off sale', category: 'Perfumes', image: { uri: 'https://www.zudio.com/cdn/shop/products/300847707001_1_576x.jpg?v=1662205084' } },
  { name: 'Dior', offers: '10% off sale', category: 'Perfumes', image: { uri: 'https://rukminim2.flixcart.com/image/750/900/kzd147k0/perfume/2/v/b/100-men-perfume-spray-edp-100ml-eau-de-parfum-christian-dior-men-original-imagbe9twhts5qcb.jpeg?q=20&crop=false' } },
  { name: 'Ustraa', offers: 'Buy 2 @ price of 1', category: 'Perfumes', image: { uri: 'https://rubnic.com/cdn/shop/files/ustraa-cologne-scuba-100-ml-perfume-for-menblue-deodorant-body-sprayblue-roll-on-50ml-329.webp?v=1692813527' } },
  { name: 'The Man Company', offers: 'Buy 2 tshirts @ price of 1', category: 'Perfumes', image: { uri: 'https://assets.myntassets.com/w_412,q_auto:best,dpr_2,fl_progressive/assets/images/14987782/2024/1/2/bb5a5e3b-fef9-480b-8705-ea1471431f0f1704197019220-THE-MAN-COMPANY-Intense-EDP-for-Men---100-ml-441170419701899-1.jpg' } },
  { name: 'Beardo', offers: '30% off sale', category: 'Perfumes', image: { uri: 'https://beardo.in/cdn/shop/files/ThugLifePerfumeCombo512x512.jpg?v=1694425283' } },
  { name: 'Denver Perfumes', offers: '15% off sale', category: 'Perfumes', image: { uri: 'https://denverformen.com/cdn/shop/products/Artboard5_1x1copy2_87c851d0-bd79-44e2-b016-c880e84181c1_800x.jpg?v=1698482044' } },
  { name: 'Villian Perfumes', offers: '30% off sale', category: 'Perfumes', image: { uri: 'https://cdn.shopify.com/s/files/1/0616/7494/6800/files/Hydra_flatlay_1_480x480.jpg?v=1645709511' } },

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
      <Text style={styles.Head}>Perfumes</Text>
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
