import { Image } from 'expo-image';
import { StyleSheet, Text, useColorScheme } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#353636' }}
      headerImage={
        <Image
          source={require('../../assets/images/deadtrains.jpg')}
          style={{ width: '100%',
          height: undefined,
          aspectRatio: 1,}}
        >
        </Image>
      }>
        <Text style={{
          color: textColor,
          fontFamily: 'Arial',
          fontSize: 25,
          fontWeight: '600',
          backgroundColor: 'transparent',
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4}}
        >
          Service Alerts (Example)
        </Text>
        <Text style={{
          color: textColor,
          fontFamily: 'Arial',
          fontSize: 15,
          fontWeight: '600',
          backgroundColor: 'transparent',
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4}}
        >
          Red and Gold line trains will not stop at Garnett, due to platform renovations. Bus shuttle service will be provided, between Garnett and Five Points. Visit https://itsmarta.com/garnettstationrehab.aspx
          xpire at: 10/22/2025 06:00 AM
        </Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
