import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
//import { Button } from '@react-navigation/elements';

const martaStations = [
  // Red Line Down To Lindbergh
  { name: 'North Springs', latitude: 33.94500907369242, longitude: -84.35719394287439, apiName: 'NORTH SPRINGS STATION'},
  { name: 'Sandy Springs', latitude: 33.932516769145295, longitude: -84.352047958534, apiName: 'SANDY SPRINGS STATION'},
  { name: 'Dunwoody', latitude: 33.921300358007414, longitude: -84.34433984309231, apiName: 'DUNWOODY STATION'},
  { name: 'Medical Center', latitude: 33.91076721287199, longitude: -84.35150652085585, apiName: 'MEDICAL CENTER STATION'},
  { name: 'Buckhead', latitude: 33.84779797225841, longitude: -84.36740956408096, apiName: 'BUCKHEAD STATION'},
  { name: 'Lindbergh Center', latitude: 33.82331713008089, longitude: -84.36852431547473, apiName: 'LINDBERGH STATION'},

  // Gold Line Down To Lindbergh
  { name: 'Doraville', latitude: 33.903122303354394, longitude: -84.27997569318664, apiName: 'DORAVILLE STATION'},
  { name: 'Chamblee', latitude: 33.88729501617548, longitude: -84.30657164387172, apiName: 'CHAMBLEE STATION'},
  { name: 'Brookhaven/Oglethorpe', latitude: 33.86075615691721, longitude: -84.33711592838881, apiName: 'BROOKHAVEN STATION'},
  { name: 'Lenox', latitude: 33.84539662868538, longitude: -84.35790776769596, apiName: 'LENOX STATION'},

  // Red/Gold Line Down To Airport + Five Points
  { name: 'Arts Center', latitude: 33.78945792188797, longitude: -84.38668054469079, apiName: 'ARTS CENTER STATION'},
  { name: 'Midtown', latitude: 33.78109566732217, longitude: -84.38632493229039, apiName: 'MIDTOWN STATION'},
  { name: 'North Avenue', latitude: 33.77180964143568, longitude: -84.38679080243986, apiName: 'NORTH AVE STATION'},
  { name: 'Civic Center', latitude: 33.76659302130697, longitude: -84.38719121387895, apiName: 'CIVIC CENTER STATION'},
  { name: 'Peachtree Center', latitude: 33.7584, longitude: -84.3876, apiName: 'PEACHTREE CENTER STATION'},
  { name: 'Five Points', latitude: 33.753962804699015, longitude: -84.391515148404, apiName: 'FIVE POINTS STATION'},
  { name: 'Garnett', latitude: 33.74879274075253, longitude: -84.39531813288356, apiName: 'GARNETT STATION'},
  { name: 'West End', latitude: 33.73626851441723, longitude: -84.4134130820566, apiName: 'WEST END STATION'},
  { name: 'Oakland City', latitude: 33.7174178646025, longitude: -84.42461370722171, apiName: 'OAKLAND CITY STATION'},
  { name: 'Lakewood/Ft. Mcpherson', latitude: 33.70102060427283, longitude: -84.42783007674628, apiName: 'LAKEWOOD STATION'},
  { name: 'East Point', latitude: 33.67945695473692, longitude: -84.43992022455714, apiName: 'EAST POINT STATION'},
  { name: 'College Park', latitude: 33.65210445174343, longitude: -84.44831775124952, apiName: 'COLLEGE PARK STATION'},
  { name: 'Airport', latitude: 33.64078981680467, longitude: -84.44629646284042, apiName: 'AIRPORT STATION'},

  // Blue Line West To East
  { name: 'Hamilton E. Holmes', latitude: 33.75449363925385, longitude: -84.470097958493, apiName: 'HAMILTON E HOLMES STATION'},
  { name: 'West Lake', latitude: 33.75322482061019, longitude: -84.44528970670807, apiName: 'WEST LAKE STATION'},
  { name: 'Ashby', latitude: 33.756304675869984, longitude: -84.41699074198087, apiName: 'ASHBY STATION'},
  { name: 'Vine City', latitude: 33.75659719493443, longitude: -84.40382471857167, apiName: 'VINE CITY STATION'},
  { name: 'GWCC/CNN Center', latitude: 33.75660997349165, longitude: -84.39699046183866, apiName: 'OMNI DOME STATION'},
  { name: 'Georgia State', latitude: 33.7505, longitude: -84.3861, apiName: 'GEORGIA STATE STATION'},
  { name: 'King Memorial', latitude: 33.750101359063535, longitude: -84.37479632943702, apiName: 'KING MEMORIAL STATION'},
  { name: 'Inman Park / Reynoldstown', latitude: 33.75787970045462, longitude: -84.35183468934682, apiName: 'INMAN PARK STATION'},
  { name: 'Edgewood-Candler Park Station', latitude: 33.76206332996031, longitude: -84.33923346739087, apiName: 'EDGEWOOD CANDLER PARK STATION'},
  { name: 'East Lake', latitude: 33.76528137160553, longitude: -84.31268608413075, apiName: 'EAST LAKE STATION'},
  { name: 'Decatur', latitude: 33.774770963754875, longitude: -84.29518864356172, apiName: 'DECATUR STATION'},
  { name: 'Avondale', latitude: 33.7751900506769, longitude: -84.28232171518957, apiName: 'AVONDALE STATION'},
  { name: 'Kensington', latitude: 33.77268962458207, longitude: -84.25178556655618, apiName: 'KENSINGTON STATION'},
  { name: 'Indian Creek', latitude: 33.76986471874239, longitude: -84.22966006928485, apiName: 'INDIAN CREEK STATION'}
];

export default function TabTwoScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
  
    const filteredStations = martaStations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const normalizeStationName = (name: string) => {
      return name
        .replace(/\//g, "/") // keep slashes for MARTA naming
        .replace(/\s+/g, " ") // remove extra spaces
        .trim()
        .toUpperCase() + " STATION";
      };

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
      <View style={styles.viewThing}>
      <Text style={styles.textFont}>
        Train Arrivals (WIP)
      </Text>

      <Button 
            title="Nearest Station"
            onPress={() => router.push({pathname: "/modal", 
            params: { stationName: "AVONDALE STATION" }})}/>

      <TextInput
          style={styles.input}
          placeholder="Search stations..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

      {filteredStations.map((station, index) => (
          <Button 
            title={station.name} 
            key={index} 
            onPress={() => router.push({
              pathname: "/modal", 
              params: { stationName: station.apiName}})}/>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  viewThing: {
    alignContent: "center"
  },
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
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 5,
    borderColor: "#333",
  }
});
