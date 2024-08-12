import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
         // Hide the header for this screen
        }}
      />
      <Tabs.Screen
        name="rateus"
        options={{
          tabBarLabel: 'Rate Us',
          tabBarIcon: ({ size, color }) => <Ionicons name="star" size={size} color={color} />,
          headerShown: false,  // Hide the header for this screen
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ size, color }) => <Ionicons name="bag" size={size} color={color} />,
          headerShown: false,  // Hide the header for this screen
        }}
      />
      <Tabs.Screen
        name="myprofile"
        options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ size, color }) => <Ionicons name="man" size={size} color={color} />,
          headerShown: false,  // Hide the header for this screen
        }}
      />
    </Tabs>
  );
};

export default Layout;
