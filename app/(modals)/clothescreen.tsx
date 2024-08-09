import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../(tabs)/firebaseConfig'; // Adjust the path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';

const shoeData = [
  { name: 'FabIndia', offers: '30% off sale', category: 'Clothes', image: { uri: 'https://apisap.fabindia.com/medias/10733947-1.jpg?context=bWFzdGVyfGltYWdlc3wxMzk5MTB8aW1hZ2UvanBlZ3xhR001TDJobE1pODRPVGN3TlRBM01UVTNOVE0wTHpFd056TXpPVFEzWHpFdWFuQm58YjUzZWI3NDFhZDkyN2RlMTQ4ZTkxNjQyYzZlYmUzYTg5YWJhYmQyOTQ2MmFmZjk3YTAyNDU5NWRkYzgxYjhhYw' } },
  { name: 'Raymond', offers: '20% off sale', category: 'Clothes', image: { uri: 'https://i.pinimg.com/originals/52/87/f6/5287f602cc11fa34799ce36bff69a9bb.png' } },
  { name: 'Levis', offers: '20% off sale', category: 'Clothes', image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScEFlIwcEkvXinHoo2GqNbf9qolN-r7G87XS9RFhB9o-aaT1XOUrDJqj6hCDKPRP8K3G8&usqp=CAU' } },
  { name: 'Van Heusen', offers: '10% off sale', category: 'Clothes', image: { uri: 'https://assets.ajio.com/medias/sys_master/root/20230707/iOvB/64a8495ca9b42d15c946314f/-473Wx593H-469524320-blue-MODEL.jpg' } },
  { name: 'Zudio', offers: '40% off sale', category: 'Clothes', image: { uri: 'https://www.zudio.com/cdn/shop/products/300903431003_1_576x.jpg?v=1662205959' } },
  { name: 'New Balance', offers: '20% off sale', category: 'Clothes', image: { uri: 'https://nb.scene7.com/is/image/NB/mj41506bk_nb_55_i?$pdpflexf2$&wid=440&hei=440' } },
  { name: 'Zara', offers: '10% off sale', category: 'Clothes', image: { uri: 'https://i.pinimg.com/originals/3c/2f/05/3c2f05b53ff6be53547f531a4bfbb27e.jpg' } },
  { name: 'Pantaloons', offers: 'Buy 2 @ price of 1', category: 'Clothes', image: { uri: 'https://www.adityabirla.com/Upload/Content_Files/pantaloons-4.png' } },
  { name: 'Puma', offers: 'Buy 2 tshirts @ price of 1', category: 'Clothes', image: { uri: 'https://assets.esdemarca.com/beta/var/images1000/3136345a.jpg' } },
  { name: 'W for Women', offers: '30% off sale', category: 'Clothes', image: { uri: 'https://wforwoman.com/cdn/shop/files/23AUW19882-220612_1_1dd41053-8e89-4135-b340-143888d9c692.jpg?v=1721363836' } },
  { name: 'Arrow', offers: '15% off sale', category: 'Clothes', image: { uri: 'https://logan.nnnow.com/content/dam/nnnow-project/19-feb-2024/arrow-ss-24/NAV3.jpg' } },
  { name: 'Max', offers: '30% off sale', category: 'Clothes', image: { uri: 'https://pbs.twimg.com/media/CQO0y47UEAASvV5.png' } },
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
    backgroundColor: '#fff',
    marginTop: 40,
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
    backgroundColor: '#f0f0f0',
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
    height: 110,
    marginBottom: 10,
  },
  buttonText: {
    color: '#333',
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
    fontSize: 18,
  },
  wishlistButton: {
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ShoeScreen;
