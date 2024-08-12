import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: 'Roboto',
          paddingBottom: 5, // Adjust this to move the label slightly up
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color="#1F4E79" />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarLabel: 'WishList',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="bag" size={size} color="#1F4E79" />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="rateus"
        options={{
          tabBarLabel: 'FeedBack',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="star" size={size} color="#1F4E79" />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="myprofile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle" size={30} color="#1F4E79" />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;