import { Image } from 'expo-image';
import { StyleSheet, Text } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function HomeScreen() {
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
        <Text style={styles.textFont}>Service Alerts (Example)</Text>
        <Text style={styles.textEntry}>
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
  textFont: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: 25,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  },
  textEntry: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  },
});
