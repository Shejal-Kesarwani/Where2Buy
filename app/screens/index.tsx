import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Platform,Text, SafeAreaView,TouchableOpacity,Image,ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';


const INITIAL_POSITION={
  latitude:12.84123,
  longitude:77.66441,
  latitudeDelta:0.0922,
  longitudeDelta:0.0421,
}

const image = { uri: "https://i.pinimg.com/564x/48/f9/18/48f918021274a4fa8275918d76139dd4.jpg" };

export default function App() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  return (
<View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />

      {errorMsg ? <Text>{Alert.alert("Error", errorMsg)}</Text> : null}

      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.buttonContainer}>
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