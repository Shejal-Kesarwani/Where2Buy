import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground, Pressable } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { Link } from 'expo-router';
import React = require('react');

const firebaseConfig = {
  apiKey: "AIzaSyCBRDGX2Hv1JSasV2yB54JpebnABA1bO_U",
  authDomain: "ecommerce1-d88c1.firebaseapp.com",
  projectId: "ecommerce1-d88c1",
  storageBucket: "ecommerce1-d88c1.appspot.com",
  messagingSenderId: "553087313843",
  appId: "1:553087313843:web:023c73d3cf89a15854cdc6"
};

// Update the image reference
const image = require('../assets/images/bg_image.png');

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authenticatedContainer}>
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.buttonPress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </Link>
      <Text style={styles.emailText}>Logged in as {user.email}</Text>
      <Pressable onPress={handleAuthentication} style={[styles.buttonPress, styles.logoutButton]}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        await signOut(auth);
        console.log('User logged out successfully!');
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ImageBackground source={image} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
        ) : (
          <AuthScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleAuthentication={handleAuthentication}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 15,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1F4E79',
  },
  input: {
    height: 50,
    width: 240,
    borderColor: '#1F4E79',
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    fontSize: 16,
    color: '#333',
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignSelf: 'stretch',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 10,
  },
  toggleText: {
    color: '#373A40',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  authenticatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    maxHeight: 300, 
  },
  buttonPress: {
    backgroundColor: '#478CCF',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#B43F3F',
  },
});