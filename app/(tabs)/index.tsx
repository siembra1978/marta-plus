import type { LocationObjectCoords } from 'expo-location';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const martaStations = [
  // Red Line Down To Lindbergh
  { name: 'North Springs', latitude: 33.94500907369242, longitude: -84.35719394287439},
  { name: 'Sandy Springs', latitude: 33.932516769145295, longitude: -84.352047958534},
  { name: 'Dunwoody', latitude: 33.921300358007414, longitude: -84.34433984309231},
  { name: 'Medical Center', latitude: 33.91076721287199, longitude: -84.35150652085585},
  { name: 'Buckhead', latitude: 33.84779797225841, longitude: -84.36740956408096},
  { name: 'Lindbergh Center', latitude: 33.82331713008089, longitude: -84.36852431547473},

  // Gold Line Down To Lindbergh
  { name: 'Doraville', latitude: 33.903122303354394, longitude: -84.27997569318664},
  { name: 'Chamblee', latitude: 33.88729501617548, longitude: -84.30657164387172},
  { name: 'Brookhaven/Oglethorpe', latitude: 33.86075615691721, longitude: -84.33711592838881},
  { name: 'Lenox', latitude: 33.84539662868538, longitude: -84.35790776769596},

  // Red/Gold Line Down To Airport + Five Points
  { name: 'Arts Center', latitude: 33.78945792188797, longitude: -84.38668054469079},
  { name: 'Midtown', latitude: 33.78109566732217, longitude: -84.38632493229039 },
  { name: 'North Avenue', latitude: 33.77180964143568, longitude: -84.38679080243986},
  { name: 'Civic Center', latitude: 33.76659302130697, longitude: -84.38719121387895},
  { name: 'Peachtree Center', latitude: 33.7584, longitude: -84.3876 },
  { name: 'Five Points', latitude: 33.753962804699015, longitude: -84.391515148404 },
  { name: 'Garnett', latitude: 33.74879274075253, longitude: -84.39531813288356},
  { name: 'West End', latitude: 33.73626851441723, longitude: -84.4134130820566},
  { name: 'Oakland City', latitude: 33.7174178646025, longitude: -84.42461370722171},
  { name: 'Lakewood/Ft. Mcpherson', latitude: 33.70102060427283, longitude: -84.42783007674628},
  { name: 'East Point', latitude: 33.67945695473692, longitude: -84.43992022455714},
  { name: 'College Park', latitude: 33.65210445174343, longitude: -84.44831775124952},
  { name: 'Airport', latitude: 33.64078981680467, longitude: -84.44629646284042},

  // Blue Line West To East
  { name: 'Hamilton E. Holmes', latitude: 33.75449363925385, longitude: -84.470097958493},
  { name: 'West Lake', latitude: 33.75322482061019, longitude: -84.44528970670807},
  { name: 'Ashby', latitude: 33.756304675869984, longitude: -84.41699074198087},
  { name: 'Vine City', latitude: 33.75659719493443, longitude: -84.40382471857167},
  { name: 'GWCC/CNN Center', latitude: 33.75660997349165, longitude: -84.39699046183866},
  { name: 'Georgia State', latitude: 33.7505, longitude: -84.3861},
  { name: 'King Memorial', latitude: 33.750101359063535, longitude: -84.37479632943702},
  { name: 'Inman Park / Reynoldstown', latitude: 33.75787970045462, longitude: -84.35183468934682},
  { name: 'Edgewood-Candler Park Station', latitude: 33.76206332996031, longitude: -84.33923346739087},
  { name: 'East Lake', latitude: 33.76528137160553, longitude: -84.31268608413075},
  { name: 'Decatur', latitude: 33.774770963754875, longitude: -84.29518864356172},
  { name: 'Avondale', latitude: 33.7751900506769, longitude: -84.28232171518957},
  { name: 'Kensington', latitude: 33.77268962458207, longitude: -84.25178556655618},
  { name: 'Indian Creek', latitude: 33.76986471874239, longitude: -84.22966006928485 }
];

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);

  useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (loc) => setLocation(loc.coords)
    );
  })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>{location?.latitude}</Text>
      <MapView 
        style={styles.map} 
        provider="google"
        pitchEnabled={false}
        rotateEnabled={false}
        showsUserLocation={true}
        initialRegion={{
          latitude: 33.753962804699015,
          longitude: -84.391515148404,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {martaStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
          >
            <View style={styles.markerContainer}>
              <Image 
                source={require('../../assets/images/trainicon.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              {/*<Text style={styles.markerText}>{station.name + ''}</Text>*/}
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerText: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 4,
  }
});
