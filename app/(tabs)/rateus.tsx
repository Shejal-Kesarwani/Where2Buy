import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Pressable } from 'react-native';
import { db } from '../(tabs)/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import StarRating from 'react-native-star-rating-widget';

export default function Rate() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

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
      <Text style={styles.text}>Rate your experience</Text>
      <StarRating
        rating={rating}
        onChange={setRating}
        starSize={30}
        color="#ffd700"
        style={{ marginBottom: 40 }}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 70,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 70,
    padding: 10,
    width: '100%',
    textAlignVertical: 'top',
  },

  button:{
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
   
    bottom: 40,
  },

  buttontext:{
    color: 'white',
    fontSize: 15,
    fontWeight: 'semibold',
  }

});
