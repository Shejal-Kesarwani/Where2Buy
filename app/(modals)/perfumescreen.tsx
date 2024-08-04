import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

const shoeData = [
  { name: 'Chanel', image: { uri: 'https://example.com/nike.png' } },
  { name: 'Adidas', image: { uri: 'https://example.com/adidas.png' } },
  { name: 'Gucci', image: { uri: 'https://example.com/puma.png' } },
  { name: 'Beardo', image: { uri: 'https://example.com/reebok.png' } },
  { name: 'Nike', image: { uri: 'https://example.com/asics.png' } },
  { name: 'Tom Ford', image: { uri: 'https://example.com/newbalance.png' } },
  { name: 'Park Avenue', image: { uri: 'https://example.com/underarmour.png' } },
  { name: 'Fogg', image: { uri: 'https://example.com/vans.png' } },
  { name: 'Prada', image: { uri: 'https://example.com/converse.png' } },
  { name: 'Hermes', image: { uri: 'https://example.com/skechers.png' } },
  { name: 'YSL', image: { uri: 'https://example.com/fila.png' } },
  { name: 'Calvin Klein', image: { uri: 'https://example.com/brooks.png' } },
];

const ShoeScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Shoes' }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {shoeData.map((shoe, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            <Image source={shoe.image} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{shoe.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop:40,
    },
    scrollContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        width: '40%', // Adjust width to fit two buttons per row with some margin
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonIcon: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        
        textAlign: 'center',
    },
    
});

export default ShoeScreen;
