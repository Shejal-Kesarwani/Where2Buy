import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert, } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';

const API_KEY = ''; // Add your API key here

const INITIAL_POSITION = {
  latitude: 12.84123,
  longitude: 77.66441,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const image = { uri: "https://i.pinimg.com/564x/48/f9/18/48f918021274a4fa8275918d76139dd4.jpg" };

export default function App() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState(INITIAL_POSITION);
  const [markers, setMarkers] = useState([]);

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

  const handlePlaceSelect = (data, details) => {
    const newRegion = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    setMarkers([...markers, newRegion]);
  };

  return (
    <View style={styles.container} >
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={handlePlaceSelect}
        query={{
          key: API_KEY,
          language: 'en',
        }}
        fetchDetails
        styles={{
          container: {
            flex: 0,
            position: 'absolute',
            width: '100%',
            zIndex: 1,
          },
          listView: { backgroundColor: 'white' },
        }}
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
        <SafeAreaView style={styles.buttonContainer}>
        <Stack.Screen
          options={{
            header: () => <ExploreHeader />,
          }}
        />
          {Array.from({ length: 8 }).map((_, index) => (
            <TouchableOpacity key={index} style={styles.button}>
              <Image source={image} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Button {index + 1}</Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 215,
  },
  map: {
    width: '100%',
    height: '50%',
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
    backgroundColor: '#6200ee',
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
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
