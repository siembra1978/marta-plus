import { Image } from 'expo-image';
import { StyleSheet, Text, useColorScheme } from 'react-native';
import * as GtfsRealtime from "../../assets/misc/gtfs-realtime.js";

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const [alerts, setAlerts] = useState<any[]>([]);

  async function getAlerts() {
    const response = await fetch(
      'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/tripupdate/tripupdates.pb'
    );
    const buffer = await response.arrayBuffer();
    const message = GtfsRealtime.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    const data = GtfsRealtime.transit_realtime.FeedMessage.toObject(message, { longs: String });
    setAlerts(data.entity);
    return (data.entity);
  }

  useEffect(() => {
    getAlerts();
  }, []);
  
  console.log(alerts);

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
