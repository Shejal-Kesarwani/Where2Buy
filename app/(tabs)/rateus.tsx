import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Pressable, Image } from 'react-native';
import { db } from '../(tabs)/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';  
import StarRating from 'react-native-star-rating-widget';

export default function Rate() {
  const [rating, setRating] = useState(0);  //star rating
  const [review, setReview] = useState(''); // text input for review

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'reviews'), {
        rating: rating,
        review: review,
      });
      alert('Review submitted successfully!');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to submit review');
    }
  };

  return (
    <View style={styles.container}>
      
      <Image
        source={{ uri: 'https://icons.veryicon.com/png/Business/Pretty%20Office%203/Star%20Half%20Full.png' }} 
        style={styles.image}
      />

      <Text style={styles.text}>Your opinion matter to us!</Text>
      
      <StarRating
        rating={rating}
        onChange={setRating}
        starSize={60}
        color="#ffd700"
        style={{ marginBottom: 30 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Write a review"
        value={review}
        onChangeText={setReview}
        multiline
      />

      <Pressable onPress={handleSubmit}  style={styles.button}>
        <Text style={styles.buttontext}>Submit</Text> 
      </Pressable>

    </View>
  
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF0F7', // Light blue background for the main container
    alignItems: 'center',
    padding: 20,
  },

  image:{
    height:'15%',
    width:'30%',
    marginTop:90,
  },
 
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F4E79', // Dark blue text color
    marginBottom: 20,
    marginTop: 50,
    borderWidth: 2,
    borderColor: '#1F4E79', // Dark blue border for the text
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#FFFFFF', // White background inside the text border
  },

  text1:{
    fontSize: 19,
    color: '#1F4E79', // Dark blue text color
    marginBottom: 20, 
    textAlign: 'center',
    backgroundColor: '#FFFFFF', 
  },

  input: {
    height: 120,
    width: '100%',
    borderColor: '#B0C4DE', // Light steel blue border
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFFFFF', // White background for the input field
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333333', // Dark gray text color
  },

  button: {
    backgroundColor: '#1F4E79', // Dark blue background for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  buttontext: {
    color: '#FFFFFF', // White text color for the button
    fontSize: 18,
    fontWeight: 'bold',
  },
});