import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; // Adjust the path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';

const shoeData = [
  { name: 'Bosch', offers: '30% off sale', category: 'Electronics', image: { uri: 'https://w7.pngwing.com/pngs/109/209/png-transparent-logo-robert-bosch-gmbh-brand-manufacturing-home-appliance-spare-parts-car-text-logo-home-appliance.png' } },
  { name: 'Samsung', offers: '20% off sale', category: 'Electronics', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE4_1aEWdkMwbedzb7SjD1SMUsCCIgEKivdA&s' } },
  { name: 'Haier', offers: '20% off sale', category: 'Electronics', image: { uri: 'https://img.etimg.com/thumb/width-1200,height-1200,imgsize-4120,resizemode-75,msid-108269779/industry/cons-products/durables/haier-aims-to-become-second-largest-appliances-marker-in-india-expanding-portfolio-and-capacity.jpg' } },
  { name: 'Panasonic', offers: '10% off sale', category: 'Electronics', image: { uri: 'https://i.pinimg.com/originals/7d/39/33/7d3933843ffd6355ee7ffe4f78e194db.png' } },
  { name: 'Lifes Good', offers: '40% off sale', category: 'Electronics', image: { uri: 'https://mma.prnewswire.com/media/1225363/LG.jpg?p=facebook' } },
  { name: 'Blue Star', offers: '20% off sale', category: 'Electronics', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAFknoIoYzjehpAy5477_Gq6bxKm6LPRYGiA&s' } },
  { name: 'Wharlpool', offers: '10% off sale', category: 'Electronics', image: { uri: 'https://t3.gstatic.com/images?q=tbn:ANd9GcTe5iA7FHADjBm7Q8-iwZEz7jp1fgOyZ8PrsPYlILxWZfQVMShA' } },
  { name: 'Hitachi', offers: 'Buy 2 @ price of 1', category: 'Electronics', image: { uri: 'https://pbs.twimg.com/profile_images/1079704116111253504/sX7yA3x7_400x400.jpg' } },
  { name: 'Havells', offers: 'Buy 2 tshirts @ price of 1', category: 'Electronics', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtC3bk82uvXDNIHUxUC8kpMYidmhapxVJqOA&s' } },
  { name: 'Bajaj', offers: '30% off sale', category: 'Electronics', image: { uri: 'https://upload.wikimedia.org/wikipedia/en/6/63/Bajaj_Electricals_logo.jpg' } },
  { name: 'Philips', offers: '15% off sale', category: 'Electronics', image: { uri: 'https://www.usa.philips.com/consumerfiles/newscenter/main/standard/resources/corporate/press/2013/Brand/Philips-Shield.jpg' } },
  { name: 'Voltas', offers: '30% off sale', category: 'Electronics', image: { uri: 'https://i.pinimg.com/736x/bb/08/0e/bb080e4e0f6588240fdb0f5e1b57d2ca.jpg' } },
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
      <Text style={styles.Head}>Electronics</Text>
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