import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        }}
      />
      <Tabs.Screen
        name="rateus"
        options={{
          tabBarLabel: 'Rate Us',
          tabBarIcon: ({ size, color }) => <Ionicons name="star" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="aboutus"
        options={{
          tabBarLabel: 'About Us',
          tabBarIcon: ({ size, color }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="myprofile"
        options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ size, color }) => <Ionicons name="man" size={size} color={color} />,
        }}
      />

    </Tabs>
  );
};

export default Layout;
