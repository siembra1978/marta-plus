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
        name="trainarrivals"
        options={{
          title: 'Train Arrivals',
          drawerLabel: 'Train Arrivals'
        }}
      />
      <Drawer.Screen
        name="alerts"
        options={{
          title: 'Alerts/Delays',
          drawerLabel: 'Alerts'
        }}
      />
    </Drawer>
  );
}
