import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(screens)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const backgroundColor = isDark ? '#000' : '#fff';
    const textColor = isDark ? '#fff' : '#000';
    const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          title: 'Arrivals',
          headerShown: true,
          headerTintColor: isDark ? '#fff' : '#000',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F6',
          },
          headerShadowVisible: false
        }}
      />
    </Stack>
  );
}
