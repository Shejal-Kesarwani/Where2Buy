import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; // Adjust the path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';

const shoeData = [
  { name: 'Mason Home', offers: '30% off sale', category: 'Home Decor', image: { uri: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRT5mn31fRMektbYrOD5wcaCfGxeE4X-V-NuxqioijI5WspfFGC' } },
  { name: 'Chumbak', offers: '20% off sale', category: 'Home Decor', image: { uri: 'https://m.economictimes.com/thumb/msid-76857996,width-1200,height-900,resizemode-4,imgsize-49611/chumbak.jpg' } },
  { name: 'Nicobar', offers: '20% off sale', category: 'Home Decor', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpVZZ6HptPc7g2MTtwqr0rSfFD6XkFUKUTWGb-AHXAa2BccvNUUVN_AP8N5uWopTb06Yg&usqp=CAU' } },
  { name: 'Fabindia', offers: '10% off sale', category: 'Home Decor', image: { uri: 'https://prod-bof-media.s3.eu-west-1.amazonaws.com/import/uploads/media/header_image/0001/02/abaebe5b4593d925c352d0afac1e6737edc6c986.jpeg' } },
  { name: 'House This', offers: '40% off sale', category: 'Home Decor', image: { uri: 'https://www.shutterstock.com/image-vector/home-decoration-sign-vector-template-260nw-396999790.jpg' } },
  { name: 'Luxe Living', offers: '20% off sale', category: 'Home Decor', image: { uri: 'https://assets.architecturaldigest.in/photos/60083b7fa87939f78414ef49/master/w_1600%2Cc_limit/Flame-of-Forest.jpg' } },
  { name: 'Urban Ladder', offers: '10% off sale', category: 'Home Decor', image: { uri: 'https://www.urbanladder.com/deadpul-public/assets/images/branding/animated-logo.b3951.gif' } },
  { name: 'Amouve', offers: 'Buy 2 @ price of 1', category: 'Home Decor', image: { uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR_zdgr3FLcFG-GPROLWRACU9DCqpvM0dAfDaUwxNWmJSu4knJ6' } },
  { name: 'Oorjaa', offers: 'Buy 2 tshirts @ price of 1', category: 'Home Decor', image: { uri: 'https://imgmedia.lbb.in/media/2023/03/64269cb5c70b643ca53753cb_1680252085835.jpg' } },
  { name: 'Amolicons', offers: '30% off sale', category: 'Home Decor', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9-PPa7yCzPrGFOe4ra6E0wVAaF-K8J2F-ZWeZ4RKWVsx6icpp' } },
  { name: 'Objectry', offers: '15% off sale', category: 'Home Decor', image: { uri: 'https://thehouseofthings.com/pub/media/ves/brand/objectry-logo-200x90.jpg' } },
  { name: 'Home Center', offers: '30% off sale', category: 'Home Decor', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5ocz9XxDopH2_-2ClbXLhJyJBI8BX0tvKGQ&s' } },
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
      <Text style={styles.Head}>Home Decor</Text>
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