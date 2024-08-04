import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});




//sk.eyJ1IjoidmlyYWotOTU3NCIsImEiOiJjbHplZnl0NGswdWk3MmlxengwaTA2eWpoIn0.vF2GJI7gZcFOujAwfPL5wA