import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../(tabs)/firebaseConfig'; 
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const shoeData = [
  { name: 'Puma', offers: '30% off sale', category: 'Shoes', image: { uri: 'https://rukminim2.flixcart.com/image/850/1000/kziqvm80/shoe/v/m/n/9-383052-9-puma-white-white-nimbus-cloud-peacoat-original-imagbg9twhztdwgk.jpeg?q=90&crop=false' } },
  { name: 'Adidas', offers: '20% off sale', category: 'Shoes', image: { uri: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/a3b3c26ba11f450a9f91ae9b00f43cb9_9366/Galaxy_6_Shoes_Black_GW3847_01_standard.jpg' } },
  { name: 'Reebok', offers: '20% off sale', category: 'Shoes', image: { uri: 'https://images.jdmagicbox.com/quickquotes/images_main/reebok-gents-shoes-04-03-2022-675-270834566-2yr3vy8w.jpg' } },
  { name: 'Fila', offers: '10% off sale', category: 'Shoes', image: { uri: 'https://assets.ajio.com/medias/sys_master/root/20230804/ENY7/64cd220aeebac147fca8a1fd/-473Wx593H-469515619-grey-MODEL.jpg' } },
  { name: 'Lotto', offers: '40% off sale', category: 'Shoes', image: { uri: 'https://assets.ajio.com/medias/sys_master/root/hbf/h75/13676128665630/-473Wx593H-450111728-white-MODEL.jpg' } },
  { name: 'Campus', offers: '20% off sale', category: 'Shoes', image: { uri: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/shoe/c/g/z/-original-imagg7t3yuwguyw7.jpeg?q=90&crop=false' } },
  { name: 'Converse', offers: '10% off sale', category: 'Shoes', image: { uri: 'https://4.imimg.com/data4/TO/GQ/ANDROID-36086933/product.jpeg' } },
  { name: 'Crocs', offers: 'Buy 2 @ price of 1', category: 'Shoes', image: { uri: 'https://www.crocs.in/media/catalog/product/2/0/206715_0dd_alt100_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=' } },
  { name: 'Nike', offers: 'Buy 2 tshirts @ price of 1', category: 'Shoes', image: { uri: 'https://assets.ajio.com/medias/sys_master/root/20240220/N1CB/65d4cb1d05ac7d77bb6a5f48/-473Wx593H-469581864-black-MODEL.jpg' } },
  { name: 'Asics', offers: '30% off sale', category: 'Shoes', image: { uri: 'https://assets.ajio.com/medias/sys_master/root/20230821/O3kz/64e38c67ddf77915195836ad/-1117Wx1400H-469433667-yellow-MODEL.jpg' } },
  { name: 'Skechers', offers: '15% off sale', category: 'Shoes', image: { uri: 'https://sslimages.shoppersstop.com/sys-master/images/h61/hbc/30553225592862/FMSK220915_BLACK_alt1.jpg_2000Wx3000H' } },
  { name: 'Bata', offers: '30% off sale', category: 'Shoes', image: { uri: 'https://images.jdmagicbox.com/quickquotes/images_main/bata-mens-footwear-24-09-2020-1342-210348124-sytyq.jpeg' } },

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
      <Text style={styles.Head}>Shoes</Text>
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
