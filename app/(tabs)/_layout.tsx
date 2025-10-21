import { Drawer } from 'expo-router/drawer';
import React from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: 'System Map',
          drawerLabel: 'System Map'
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'Train Arrivals',
          drawerLabel: 'Train Arrivals'
        }}
      />
      <Drawer.Screen
        name="streetcar"
        options={{
          title: 'Test',
          drawerLabel: 'Test2'
        }}
      />
    </Drawer>
  );
}
