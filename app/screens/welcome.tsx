import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Platform,Text, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';


const INITIAL_POSITION={
  latitude:12.84123,
  longitude:77.66441,
  latitudeDelta:0.0922,
  longitudeDelta:0.0421,
}

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
      >
     
      </MapView>
      {errorMsg ? <Text>{Alert.alert("Error", errorMsg)}</Text> : null}

      <Text style={styles.textt}>Hello welcome to Where2Buy, a application that makes your shopping easy for your pocket </Text>

      <SafeAreaView>

      </SafeAreaView>
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
    marginBottom:340,
  },
  textt: {
    fontSize: 18,
    bottom:310,

  },
});
