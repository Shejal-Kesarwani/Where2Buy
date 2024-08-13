import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; // Adjust the path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';

const shoeData = [
  { name: 'Toys ', offers: '30% off sale', category: 'Kids Store', image: { uri: 'https://images.hellomagazine.com/horizon/square/9f9b151047f8-top-toys-2023-best-kids-toys-for-christmas.jpg' } },
  { name: 'Puzzles', offers: '50% off sale', category: 'Kids Store', image: { uri: 'https://m.media-amazon.com/images/I/71Y77gJgE0L.jpg' } },
  { name: 'FirstCry', offers: 'Get2@1 Price', category: 'Kids Store', image: { uri: 'https://pbs.twimg.com/profile_images/1232546599206703104/IdVHvM1q_400x400.jpg' } },
  { name: 'Combo Kit', offers: '10% off sale', category: 'Kids Store', image: { uri: 'https://static.wixstatic.com/media/dc3a49_2283b995e7f147a298861e1b50533dde~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/dc3a49_2283b995e7f147a298861e1b50533dde~mv2.png' } },
  { name: 'Kids Footwear', offers: '40% off sale', category: 'Kids Store', image: { uri: 'https://staranddaisy.in/wp-content/uploads/2022/07/foot3019_pink.jpg' } },
  { name: 'Hopscotch', offers: '20% off sale', category: 'Kids Store', image: { uri: 'https://media.licdn.com/dms/image/C4E0BAQHiZwYH_Gc9Lw/company-logo_200_200/0/1631348602816?e=2147483647&v=beta&t=-6iVS7XYigJbwAkXmpKiiqQayvKUZYlMo9c3sd4BqJc' } },
  { name: 'Hamleys', offers: '15% off sale', category: 'Kids Store', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgGVSZwfszs9zHO0X7RHud8PIpyY6NYNDAag&s' } },
  { name: 'Back to school', offers: 'Buy1Get2', category: 'Kids Store', image: { uri: 'https://images.meesho.com/images/products/254005107/qbntz_512.webp' } },
  { name: 'Giny&Jony', offers: '30% off sale', category: 'Kids Store', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYkkGcXAR7GYFIDIzXNbw6EmNx8H9p1HsHUA&s' } },
  

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
      <Text style={styles.Head}>Kids Store</Text>
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