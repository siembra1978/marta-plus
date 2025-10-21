import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';

type Train = {
  DESTINATION: string;
  DIRECTION: string;
  EVENT_TIME: string;
  IS_REALTIME: string;
  LINE: string;
  NEXT_ARR: string;
  STATION: string;
  TRAIN_ID: string;
  WAITING_SECONDS: string;
  WAITING_TIME: string;
  DELAY: string;
  LATITUDE: string;
  LONGITUDE: string;
}

const martaUrl = process.env.EXPO_PUBLIC_MARTA_API_URL!;

if (!martaUrl) {
  throw new Error("Missing EXPO_PUBLIC_MARTA_API_URL environment variable");
}

export default function TabTwoScreen() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<Train[]>([]);
  
    const getTrains = async () => {
      if (!martaUrl) {
        console.error("No MARTA API Key Set!");
        return;
      }
  
      try {
        const response = await fetch(martaUrl);
        const json: Train[] = await response.json();
  
        const latestTrains = Object.values(
          json.reduce((acc: Record<string, Train>, curr: Train) => {
            if (!curr.TRAIN_ID || curr.IS_REALTIME !== 'true') return acc;
            const prev = acc[curr.TRAIN_ID];
            const currWait = parseInt(curr.WAITING_SECONDS, 10);
            if (!prev || currWait < parseInt(prev.WAITING_SECONDS, 10)) {
              acc[curr.TRAIN_ID] = curr;
            }
            return acc;
        }, {})
        );
  
        setData(latestTrains)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      const interval = setInterval(getTrains, 1000);
      return () => clearInterval(interval);
    }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
        source={require('../../assets/images/maxresdefault.jpg')}
        style={{ width: '100%',
        height: undefined,
        aspectRatio: 1,}}
        >

        </Image>
      }>
      <Text style={styles.textFont}>
        Train Arrivals (WIP)
      </Text>

      {data.filter((train) => train.IS_REALTIME === "true" && train.LATITUDE && train.LONGITUDE).map((train, index) => {
          const direction = train.DIRECTION?.toUpperCase();
          const line = train.LINE?.charAt(0).toUpperCase() + train.LINE?.slice(1).toLowerCase();
          
          return (
              <Text key={index} style={styles.entryFont}>
                #{train.TRAIN_ID}: {train.DIRECTION} {train.LINE}; Arriving at {train.STATION} at {train.NEXT_ARR}
                </Text>
          )
          }
        )}
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textFont: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  },
  entryFont: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  }
});
