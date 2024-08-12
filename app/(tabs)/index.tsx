import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Stack, Link, useRouter } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API Key

const INITIAL_POSITION = {
  latitude: 12.84123,
  longitude: 77.66441,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const ImageButton = ({ image, text, href }) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.button}>
        <Image source={image} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </Link>
  );
};

const App = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null); // live location
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // error while fetching the map
  const [region, setRegion] = useState(INITIAL_POSITION); // current city or town
  const [markers, setMarkers] = useState([]); // button to get live location
  const [searchQuery, setSearchQuery] = useState(''); // search query state
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleSearch = () => {
    const query = encodeURIComponent(`${searchQuery} store near me`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const handlePlaceSelect = (data, details) => {
    const newRegion = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    setMarkers([...markers, newRegion]);
    setSearchQuery(data.description); // Set the search query for the search button
  };

  const buttonData = [
    { image: { uri: 'https://w7.pngwing.com/pngs/469/622/png-transparent-sneakers-shoe-puma-oakley-inc-sunglasses-men-shoes-white-leather-outdoor-shoe.png' }, text: 'Shoes', href: '/(modals)/shoescreen' },
    { image: { uri: 'https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/2a9bff8cb30341c0847bac8200bc5fb3_9366/adicolor-sst-track-suit.jpg' }, text: 'Clothes', href: '/(modals)/clothescreen' },
    { image: { uri: 'https://beardo.in/cdn/shop/products/8013-the-unholy-perfume-trio-2160x2160-fop.webp?v=1681904627' }, text: 'Perfumes', href: '/(modals)/perfumescreen' },
    { image: { uri: 'https://economictimes.indiatimes.com/thumb/resizemode-4,width-1200,height-900,msid-75668135/grocery-getty-f.jpg?from=mdr' }, text: 'Grocery', href: '/(modals)/groceryscreen' },
    { image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5B9p8-8aYg6Lu_hHgeLMZXayzoFQSxsW5g&s' }, text: 'Kids Store', href: '/(modals)/kidsstorescreen' },
    { image: { uri: 'https://images.herzindagi.info/image/2022/Nov/street-food-1.jpg' }, text: 'Food', href: '/(modals)/foodscreen' },
    { image: { uri: 'https://zugunu.com/wp-content/uploads/2021/09/In-Circle-Antique-Peacock-Wall-Decor-1.jpg' }, text: 'Home Decor', href: '/(modals)/homedecorscreen' },
    { image: { uri: 'https://static.toiimg.com/thumb/resizemode-4,width-1200,height-900,msid-108913583/108913583.jpg' }, text: 'Electronics', href: '/(modals)/electronicsscreen', offers: "30% off sale" },
  ];

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2}
        returnKeyType={'search'}
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: API_KEY,
          language: 'en',
          types: '(cities)',
        }}
        styles={{
          textInput: styles.searchInput,
          container: styles.searchContainer,
          listView: styles.suggestionsContainer,
        }}
        textInputProps={{
          onChangeText: setSearchQuery,
        }}
        renderRightButton={() => (
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
        )}
      />

      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
      </MapView>

      {errorMsg ? <Text>{Alert.alert("Error", errorMsg)}</Text> : null}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.text}>Browse By Category</Text>
        <SafeAreaView style={styles.buttonContainer}>
          <Stack.Screen
            options={{
              header: () => <ExploreHeader />,
            }}
          />
          {buttonData.map((data, index) => (
            <ImageButton key={index} image={data.image} text={data.text} href={data.href} />
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 215,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  searchContainer: {
    position: 'absolute',
    bottom: 600,
    width: '90%',
    zIndex: 1,
    alignSelf: 'center',

  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 50, // To make space for the search icon
    borderColor: '#ccc',
    borderWidth: 1,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
});

export default App;
