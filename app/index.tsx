import  { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';


// Usage example



const firebaseConfig = {
  apiKey: "AIzaSyCBRDGX2Hv1JSasV2yB54JpebnABA1bO_U",
  authDomain: "ecommerce1-d88c1.firebaseapp.com",
  projectId: "ecommerce1-d88c1",
  storageBucket: "ecommerce1-d88c1.appspot.com",
  messagingSenderId: "553087313843",
  appId: "1:553087313843:web:023c73d3cf89a15854cdc6"
};


const image = { uri: "https://i.pinimg.com/564x/48/f9/18/48f918021274a4fa8275918d76139dd4.jpg" };
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
}



//authenticated screen after the login
const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authenticatedContainer}>
    <Link href="/(tabs)" asChild>
      <Pressable style={styles.buttonPress}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </Link>
    <Text style={styles.emailText}>Logged in as {user.email}</Text>
    <Pressable onPress={handleAuthentication} style={[styles.button, styles.logoutButton]}>
      <Text style={styles.buttonText}>Logout</Text>
    </Pressable>
  </View>
  );
};
export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
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
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ImageBackground source={image} style={styles.background}>
    <ScrollView contentContainerStyle={styles.container}>
      
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
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
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%', 
    marginTop: 210, 
    marginBottom: 320, 
    backgroundColor: '#f0f0f0',
    borderRadius: 10, 
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 50, 
    borderRadius: 10, 
    elevation: 5, 
  },
  title: {
    fontSize: 28, 
    marginBottom: 20, 
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333', 
  },
  input: {
    height: 45, 
    borderColor: '#ccc', 
    borderWidth: 1,
    marginBottom: 20, 
    padding: 10, 
    borderRadius: 8, 
    backgroundColor: '#fff',
    width:210, 
  },
  buttonContainer: {
    marginBottom: 20, 
    width: '100%',
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 10, 
  },
  bottomContainer: {
    marginTop: 30,
    bottom:40, 

  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPress: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10,
  },
  authenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
});
