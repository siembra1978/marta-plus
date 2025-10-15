import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Train',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tram" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Bus',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="streetcar"
        options={{
          title: 'Streetcar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="logo.playstation" color={color} />,
        }}
      />
    </Tabs>
  );
}
