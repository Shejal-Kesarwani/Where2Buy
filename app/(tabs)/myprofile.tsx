import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TextInput, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import expo-av for audio playback

// Import the logo image
import appLogo from '../(tabs)/app_logo1233.png';

const buttonData = [
  { image: { uri: 'https://w7.pngwing.com/pngs/469/622/png-transparent-sneakers-shoe-puma-oakley-inc-sunglasses-men-shoes-white-leather-outdoor-shoe.png' }, text: 'History', href: '/(modals)/history' },
  { image: { uri: 'https://example.com/music-icon.png' }, text: 'My Music', href: '/(modals)/music' }
];

export default function App() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [musicModalVisible, setMusicModalVisible] = useState(false);
  const [musicFiles, setMusicFiles] = useState([
    { title: 'Song 1', uri: 'https://dn720303.ca.archive.org/0/items/i-aint-worried/I%20Aint%20Worried.mp3' },
    { title: 'Song 2', uri: 'https://ia801308.us.archive.org/0/items/PursuitOfHappinessz/KidCudi-PursuitOfHappinessfeat.MgmtRatatat-Hnhh.mp3' }
  ]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [sound, setSound] = useState(null); // State to manage the audio playback
  const [isPlaying, setIsPlaying] = useState(false); // State to manage playback status

  const navigation = useNavigation();

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
          setImage(userData.image);
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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openMusicModal = () => {
    setMusicModalVisible(true);
  };

  const closeMusicModal = () => {
    setMusicModalVisible(false);
  };

  const playMusic = async (uri) => {
    if (sound) {
      await sound.unloadAsync(); // Stop the previous sound if it's playing
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri }
    );
    setSound(newSound);
    await newSound.playAsync();
    setSelectedMusic(uri);
    setIsPlaying(true); // Set playback status to true
  };

  const pauseMusic = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false); // Set playback status to false
    }
  };

  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false); // Set playback status to false
    }
  };

  const visitHistory = [
    { shop: 'Zudio', time: '2024-08-01 10:00 AM' },
    { shop: 'Levis', time: '2024-08-02 02:30 PM' },
    { shop: 'Puma', time: '2024-08-03 04:15 PM' }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F4E79', '#EAF0F7']}
        style={styles.headerContainer}
      >
        <Image source={appLogo} style={styles.logo} />
        <Text style={styles.header}>Edit Profile</Text>
      </LinearGradient>
      
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Tap to set profile picture</Text>
            </View>
          )}
        </TouchableOpacity>
        <SafeAreaView style={styles.buttonContainer}>
    {buttonData.map((data, index) => (
      <TouchableOpacity 
        key={index} 
        style={styles.historyButton}
        onPress={data.text === 'History' ? openModal : openMusicModal}
      >
        <Text style={styles.historyButtonText}>{data.text}</Text>
      </TouchableOpacity>
    ))}
  </SafeAreaView>
      </View>
      
      <View style={styles.content}>
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
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      {/* History Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>History Details</Text>
            {visitHistory.length > 0 ? (
              visitHistory.map((visit, index) => (
                <View key={index} style={styles.visitItem}>
                  <Text style={styles.shopName}>{visit.shop}</Text>
                  <Text style={styles.visitTime}>{visit.time}</Text>
                </View>
              ))
            ) : (
              <Text>No visit history found.</Text>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Music Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={musicModalVisible}
        onRequestClose={closeMusicModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Music For Your Journey To Store</Text>
            {musicFiles.length > 0 ? (
              musicFiles.map((file, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.musicItem}
                  onPress={() => playMusic(file.uri)}
                >
                  <Text style={styles.musicTitle}>{file.title}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No music files found.</Text>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeMusicModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
            {isPlaying ? (
              <TouchableOpacity style={styles.controlButton} onPress={pauseMusic}>
                <Text style={styles.controlButtonText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.controlButton} onPress={() => playMusic(selectedMusic)}>
                <Text style={styles.controlButtonText}>Play</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.controlButton} onPress={stopMusic}>
              <Text style={styles.controlButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
    marginTop: 80,
  },
  headerContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    position: 'relative',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 165,
    fontFamily: 'sans-serif',
  },
  profileImageContainer: {
    marginTop: -60,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Space buttons evenly
    width: '100%', // Ensure container takes full width
    paddingHorizontal: 20, // Add some horizontal padding
  },
  historyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent background
    height: 40,
    width: 40,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1, // Border to enhance the glass effect
    borderColor: 'rgba(255, 255, 255, 0.6)',
    flex: 1, // Allow buttons to stretch evenly
    marginHorizontal: 5, // Add margin between buttons
    alignItems: 'center',
  },
  historyButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    top: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    bottom: 20,
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
  button: {
    marginTop: 30,
    backgroundColor: '#1F4E79',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '60%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  visitItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitTime: {
    fontSize: 14,
    color: 'gray',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  controlButton: {
    backgroundColor: '#1F4E79',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  musicItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  musicTitle: {
    fontSize: 16,
  },
});
