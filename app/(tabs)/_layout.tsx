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
          title: 'MARTA+',
          drawerLabel: 'System Map'
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'MARTA+',
          drawerLabel: 'Test1'
        }}
      />
      <Drawer.Screen
        name="streetcar"
        options={{
          title: 'MARTA+',
          drawerLabel: 'Test2'
        }}
      />
    </Drawer>
  );
}
