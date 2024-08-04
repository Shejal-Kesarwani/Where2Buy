import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from './firebaseConfig';
import { HelloWave } from '@/components/HelloWave';

export default function App() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setAddress(userData.address);
          setPhone(userData.phone);
          setImage(userData.image); // Assuming image URL is stored in the user document
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while picking the image.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${new Date().toISOString()}.jpg`);
      const snapshot = await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), { image: imageUrl }, { merge: true });
      }
      
      console.log('Uploaded a blob or file!', snapshot);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while uploading the image.');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          name,
          address,
          phone,
          email,
          image
        });
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <HelloWave/>
      <Text style={styles.header}>Edit Profile</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false}
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    color: '#fff',
  },
});
