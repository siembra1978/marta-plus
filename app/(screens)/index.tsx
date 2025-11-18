import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import type { LocationObjectCoords } from 'expo-location';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GtfsRealtime from "../../assets/misc/gtfs-realtime.js";
import shapesRaw from '../../assets/transit_info/shapes.json';

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]

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
  { name: 'Edgewood-Candler Park', latitude: 33.76206332996031, longitude: -84.33923346739087, apiName: 'EDGEWOOD CANDLER PARK STATION'},
  { name: 'East Lake', latitude: 33.76528137160553, longitude: -84.31268608413075, apiName: 'EAST LAKE STATION'},
  { name: 'Decatur', latitude: 33.774770963754875, longitude: -84.29518864356172, apiName: 'DECATUR STATION'},
  { name: 'Avondale', latitude: 33.7751900506769, longitude: -84.28232171518957, apiName: 'AVONDALE STATION'},
  { name: 'Kensington', latitude: 33.77268962458207, longitude: -84.25178556655618, apiName: 'KENSINGTON STATION'},
  { name: 'Indian Creek', latitude: 33.76986471874239, longitude: -84.22966006928485, apiName: 'INDIAN CREEK STATION'},

  // Green Line Only
  { name: 'Bankhead', latitude: 33.772270360054954, longitude: -84.42894467065514, apiName: 'BANKHEAD STATION'}
];

const trainIcons: Record<string, any> = {
  NRed: require('../../assets/trainicons/NRed.png'),
  SRed: require('../../assets/trainicons/SRed.png'),
  ERed: require('../../assets/trainicons/ERed.png'),
  WRed: require('../../assets/trainicons/WRed.png'),

  NBlue: require('../../assets/trainicons/NBlue.png'),
  SBlue: require('../../assets/trainicons/SBlue.png'),
  EBlue: require('../../assets/trainicons/EBlue.png'),
  WBlue: require('../../assets/trainicons/WBlue.png'),

  NGold: require('../../assets/trainicons/NGold.png'),
  SGold: require('../../assets/trainicons/SGold.png'),
  EGold: require('../../assets/trainicons/EGold.png'),
  WGold: require('../../assets/trainicons/WGold.png'),

  NGreen: require('../../assets/trainicons/NGreen.png'),
  SGreen: require('../../assets/trainicons/SGreen.png'),
  EGreen: require('../../assets/trainicons/EGreen.png'),
  WGreen: require('../../assets/trainicons/WGreen.png'),
};

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

interface ShapePoint {
  shape_id: string;
  shape_pt_lat: string;
  shape_pt_lon: string;
  shape_pt_sequence: string;
}

const shapes = shapesRaw as ShapePoint[];

const railLines: Record<string, string> = {
  BLUE: '136023',
  GREEN: '136065',
  RED: '136081',
  GOLD: '136044',
};

const lineColors: Record<string, string> = {
  BLUE: '#1976D2',
  GREEN: '#388E3C',
  RED: '#D32F2F',
  GOLD: '#FFD700',
};

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const martaUrl = process.env.EXPO_PUBLIC_MARTA_API_URL!;

if (!martaUrl) {
  throw new Error("Missing EXPO_PUBLIC_MARTA_API_URL environment variable");
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000;
}

export default function HomeScreen() {
  const lineCoords = useMemo(() => {
    const result: Record<string, { latitude: number; longitude: number }[]> = {};

    
    Object.entries(railLines).forEach(([lineName, shapeId]) => {
      const coords = shapes
        .filter((s) => s.shape_id === shapeId)
        .map((s) => ({
          latitude: parseFloat(s.shape_pt_lat),
          longitude: parseFloat(s.shape_pt_lon),
          seq: parseInt(s.shape_pt_sequence, 10),
        }))
        .sort((a, b) => a.seq - b.seq)
        .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));

      result[lineName] = coords;
    });

    return result;
  }, []);

  const mapRef = useRef<MapView>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme == 'dark';
  const textColor = isDark ? '#fff' : '#000';

  const activeColor = isDark ? '#fff' : '#000';
  const inactiveColor = isDark ? '#bbb' : '#555';
  const activeBg = isDark ? '#222' : '#e6e6e6';

  const bottomSheetRef = useRef<BottomSheet>(null);

  const insets = useSafeAreaInsets();

  const buttons: { label: string; icon: IoniconName }[] = [
    { label: 'Trains', icon: 'subway' },
    { label: 'Buses', icon: 'bus' },
    { label: 'Streetcar', icon: 'train' },
  ];
  const [selectedTransport, setSelectedTransport] = useState('Trains');

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  
  const router = useRouter();
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Train[]>([]);
  const [allData, setAllData] = useState<Train[]>([]);
  const [nearestStation, setNearestStation] = useState<{ name: string; apiName: string } | null>(null);
  const [buses, setBuses] = useState<any[]>([]);
  const [ridingTrain, setRidingTrain] = useState(false);
  const [nearestTrain, setNearestTrain] = useState<Train | null>(null);
  const [selectedLine, setSelectedLine] = useState("ALL");

  async function getBuses() {
    const response = await fetch(
      'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/VehiclePositions.pb'
    );
    const buffer = await response.arrayBuffer();
    const message = GtfsRealtime.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    const data = GtfsRealtime.transit_realtime.FeedMessage.toObject(message, { longs: String });
    setBuses(data.entity);
    return (data.entity);
  }

  const getTrains = async () => {
    if (!martaUrl) {
      console.error("No MARTA API Key Set!");
      return [];
    }

    try {
      const response = await fetch(martaUrl);
      const json: Train[] = await response.json();

      setAllData(json)
      
      try {
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
        
        setData(latestTrains);
        setLoading(false);
        return (latestTrains);
      } catch (error) {
        console.log('MARTA API Response:', json);
        return([]);
      }
    } catch (error) {
      console.log(error)
      return([]);
      //console.log("ERROR: " + error +" | Usually caused by MARTA API problems");
    }
  }

  const initData = async () => {
    const trains = await getTrains();
    const buses = await getBuses();

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let nearestStation = null;
      let nearestTrain = null;
      let minDistanceS = Infinity;
      let minDistanceT = Infinity;

      for (let station of martaStations) {
        const distance = haversineDistance(latitude, longitude, station.latitude, station.longitude);

        if (distance < minDistanceS) {
          minDistanceS = distance;
          nearestStation = station;
        }
      }

      //console.log("train length: " + trains.length);
      if (trains && trains.length > 0) {
        for (let train of trains) {
          //console.log("analyzing distance from user to " + train.TRAIN_ID);
          const distance = haversineDistance(latitude, longitude, parseFloat(train.LATITUDE), parseFloat(train.LONGITUDE));

          //console.log(distance, minDistanceT);

          if (distance < minDistanceT) {
            minDistanceT = distance;
            nearestTrain = train;
            //console.log("nearest train calculated: " + nearestTrain.TRAIN_ID)
          }
        }

        if (nearestTrain) {
          //console.log("nearest train set: " + nearestTrain.TRAIN_ID)
          setNearestTrain(nearestTrain);
        } else {
          console.log("no train found")
          alert('No nearby train found.');
        }

        const isMovingFast = location.coords.speed && location.coords.speed > 7;

        if (minDistanceT <= 40 && isMovingFast) {
          //console.log("riding train")
          setRidingTrain(true);
        } else {
          //console.log("not riding train")
          //setRidingTrain(true);
          setRidingTrain(false);
        }
      }

      if (nearestStation) {
        setNearestStation(nearestStation);
      } else {
        alert('No nearby station found.');
      }

    } catch (error) {
      console.error(error);
      alert('Error finding nearest station.');
    }
  };

  function focusOn(lat: number, lon: number) {
    //console.log("focusing!")
    bottomSheetRef.current?.collapse();
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500
    );
  }

  const nearestStationArrivals = allData
      .filter((train) => train.STATION === nearestStation?.apiName)
      //.filter((train) => train.STATION === "FIVE POINTS STATION")
      .sort((a, b) => parseInt(a.WAITING_SECONDS, 10) - parseInt(b.WAITING_SECONDS, 10));

  useEffect(() => {
    initData()
    const interval = setInterval(() => {initData()}, 10000);
    return () => clearInterval(interval);
  }, []);

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

  /*
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{backgroundColor: isDark ? '#1C1C1E' : '#F2F2F6', flex: 1, alignItems:'center', justifyContent: 'center'}}>
          <Text style={{    
                color: 'white',
                fontFamily: 'Arial',
                fontSize: 20,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4
          }}>Loading train data...</Text>
        </View>
      </SafeAreaProvider>
    );
  } 
  */

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView 
        style={{
          flex: 1,
          backgroundColor: isDark ? '#1C1C1E' : '#F2F2F6'
        }}
      >
        <View style={styles.container}>
          
          {isLoading && (
          <View>
            <Text style={{    
                  color: 'white',
                  fontFamily: 'Arial',
                  fontSize: 20,
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 4,
                  textAlign: 'center'
            }}>
              Loading train data...
            </Text>
          </View>
          )}
          
          {/*nearestTrain && (
            <View style={{borderWidth:4, borderColor: '#000', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                <Text style={{    
                    color: 'white',
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontWeight: 'bold',
                    backgroundColor: '#000',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                    textAlign: 'center'
              }}>
                Now Riding
              </Text>
              <Text style={{    
                    color: 'white',
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontWeight: 'bold',
                    backgroundColor: '#000',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                    textAlign: 'center'
              }}>
                {nearestTrain.TRAIN_ID} | {nearestTrain.LINE} | {nearestTrain.STATION} @ {nearestTrain.WAITING_TIME}
              </Text>
            </View>
          )*/}

          <MapView 
            style={styles.map} 
            ref={mapRef}
            //provider="google"
            pitchEnabled={false}
            rotateEnabled={false}
            showsUserLocation={true}
            onPanDrag={() => {}}
            customMapStyle={isDark ? mapStyle : []}
            initialRegion={
              {
              latitude: location ? location.latitude : 33.753962804699015,
              longitude: location ? location.longitude : -84.391515148404,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }
          }
          >
            {selectedTransport === 'Trains' &&  (
                <>
                  {Object.keys(lineCoords).map((lineName) => (
                    <Polyline
                      key={lineName}
                      coordinates={lineCoords[lineName]}
                      strokeColors={[lineColors[lineName]]}
                      strokeWidth={5}
                    />
                  ))}
                  {martaStations.map((station, index) => (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: station.latitude,
                        longitude: station.longitude,
                      }}
                      title={station.name}
                      onPress={() => focusOn(station.latitude, station.longitude)}
                    >
                      <View style={styles.markerContainer}>
                        <Image 
                          source={require('../../assets/images/trainicon.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      </View>
                    </Marker>
                  ))}

                  {data
                    .filter(
                      (train) =>
                        train.IS_REALTIME === "true" &&
                        train.LATITUDE &&
                        train.LONGITUDE
                    )
                    .map((train, index) => {
                      const direction = train.DIRECTION?.toUpperCase();
                      const line =
                        train.LINE?.charAt(0).toUpperCase() +
                        train.LINE?.slice(1).toLowerCase();
                      const iconText = `${direction}${line}`;
                      const icon =
                        trainIcons[iconText] ||
                        require("../../assets/images/icon.png");

                      return (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude: +train.LATITUDE,
                            longitude: +train.LONGITUDE,
                          }}
                          title={`${train.TRAIN_ID} | ${train.LINE} - ${train.DESTINATION}`}
                          description={`Next arrival: ${train.STATION} | ${train.WAITING_TIME}`}
                          onPress={() => focusOn(+train.LATITUDE, +train.LONGITUDE)}
                        >
                          <View 
                            style={styles.markerContainer}
                          >
                            <Image
                              source={icon}
                              style={{ width: 25, height: 25 }}
                              resizeMode="contain"
                            />
                          </View>
                        </Marker>
                      );
                    })}
                </>
            )}

            {selectedTransport === 'Buses' && (
              <>
                {buses.map((bus) => {
                  const pos = bus.vehicle?.position;
                  if (!pos) return null;
                  return (
                    <Marker
                      key={bus.id}
                      coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
                      title={`Bus ${bus.id}`}
                      onPress={() => focusOn(parseFloat(pos.latitude), parseFloat(pos.longitude))}
                    >
                      <View style={styles.markerContainer}>
                        <Image 
                          source={require('../../assets/images/busicon.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                        <Text style={{color:textColor}}>{bus.id}</Text>
                      </View>
                    </Marker>
                  );
                })}
              </>
            )}

            {selectedTransport ==='Streetcar' && (
              <>
              </>
            )}
          </MapView>

          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['40%','100%']}
            onChange={handleSheetChanges}
            enableDynamicSizing={false}
            enablePanDownToClose={false}
            style={{
                flex: 1,
                backgroundColor: 'transparent',
            }}
            backgroundStyle={{
              backgroundColor: isDark ? '#000' : '#F2F2F6'
            }}
            handleStyle={{
              backgroundColor: isDark ? '#000' : '#F2F2F6',
              borderTopLeftRadius: 64,
              borderTopRightRadius: 64,
            }}
            handleIndicatorStyle={{
              backgroundColor: isDark ? '#FFF' : '#000'
            }}
          >
              <Text style={{
                color: textColor,
                fontFamily: 'Arial',
                fontSize: 15,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                textAlign: 'center'
              }}>
                Nearby
              </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                backgroundColor: isDark ? '#000' : '#F2F2F6',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              {buttons.map((btn, i) => {

                return (
                  <Pressable
                    key={i}
                    onPress={() => setSelectedTransport(btn.label)}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 25,
                        padding: 10,
                        marginHorizontal: 5,
                        backgroundColor: selectedTransport == btn.label ? activeBg : pressed ? isDark ? '#333': '#ddd': 'transparent',
                      },
                    ]}
                  >
                    <Ionicons
                      name={btn.icon}
                      size={25}
                      color={selectedTransport === btn.label ? activeColor : inactiveColor}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color: selectedTransport === btn.label ? activeColor : inactiveColor,
                        fontFamily: 'Arial',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}
                    >
                      {btn.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {selectedTransport === 'Trains' && !ridingTrain ? (
              <View>
                <Text style={{
                  color: textColor,
                  fontFamily: 'Arial',
                  fontSize: 35,
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 4,
                  textAlign: 'center'
                }}>
                  Train Arrivals
                </Text>
                <Text style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 25,
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                        marginVertical: 6,
                        marginHorizontal: 12,
                        borderRadius: 16,
                        fontWeight: 'bold',
                        backgroundColor: '#1976D2',
                        borderWidth: 3,
                        borderColor:'#1976D2',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3,
                        elevation: 2,
                        textShadowRadius: 10,
                        textShadowOffset: { width: 5, height: 5 },
                        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
                }}>
                  {nearestStation?.name} Station
                </Text>

                <BottomSheetFlatList
                  data={nearestStationArrivals}
                  keyExtractor={(_: any, index: { toString: () => any; }) => index.toString()}
                  renderItem={({ item }: { item: Train }) => (
                    <Pressable
                      onPress={() => focusOn(parseFloat(item.LATITUDE), parseFloat(item.LONGITUDE))}
                    >
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 6,
                          paddingHorizontal: 16,
                          marginVertical: 6,
                          marginHorizontal: 12,
                          borderRadius: 16,
                          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                          borderWidth: 3,
                          borderColor:
                            item.LINE.toLowerCase() === 'red' ? '#D32F2F' :
                            item.LINE.toLowerCase() === 'gold' ? '#FFD700' :
                            item.LINE.toLowerCase() === 'blue' ? '#1976D2' :
                            item.LINE.toLowerCase() === 'green' ? '#388E3C' :
                            '#808080',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.15,
                          shadowRadius: 3,
                          elevation: 2,
                          overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
                        }}
                      >
                        <Text style={{
                          color: isDark ? '#FFF' : '#000',
                          fontFamily: 'Arial',
                          fontSize: 25,
                          fontWeight: 'bold',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor:
                            item.LINE.toLowerCase() === 'red' ? '#D32F2F' :
                            item.LINE.toLowerCase() === 'gold' ? '#FFD700' :
                            item.LINE.toLowerCase() === 'blue' ? '#1976D2' :
                            item.LINE.toLowerCase() === 'green' ? '#388E3C' :
                            '#808080',
                          textShadowRadius: 10,
                          textShadowOffset: { width: 5, height: 5 }
                        }}>
                          {item.LINE.charAt(0) + item.LINE.toLowerCase().slice(1, item.LINE.length)}
                        </Text>
                        <Text style={{
                          color: isDark ? '#FFF' : '#000',
                          fontFamily: 'Arial',
                          fontSize: 25,
                          fontWeight: 'bold',
                          backgroundColor: 'transparent',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}>
                          {item.DESTINATION}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{    
                            color: isDark ? '#FFF' : '#000',
                            fontFamily: 'Arial',
                            fontSize: 20,
                            fontWeight: '600',
                            backgroundColor: 'transparent',
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            borderRadius: 4
                          }}>
                          {parseInt(item.WAITING_SECONDS) < 60 ? `${item.WAITING_SECONDS}s` : `${item.WAITING_TIME}`}
                          </Text>

                          {item.IS_REALTIME === "true" && (
                            <Ionicons
                              name={"radio"}
                              size={25}
                              color={isDark ? '#FFF' : '#000'}
                              style={{ marginRight: 8 , paddingHorizontal: 2}}
                            />
                          )}
                        </View>
                      </View>
                    </Pressable>
                )}
                  contentContainerStyle={{ paddingBottom: insets.bottom + 250 }}
                  ListEmptyComponent={
                    <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black',
                            width: '100%',
                          }}
                    >
                      <Text style={{    
                          color: 'white',
                          fontFamily: 'Arial',
                          fontSize: 20,
                          fontWeight: '600',
                          backgroundColor: '#000',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                      }}
                      >
                        No trains found for this station.
                      </Text>
                    </View>
                      }
                />
              </View>
            ) :
            selectedTransport=== 'Trains' && ridingTrain ? (
            <View>
              <Text style={{
                color: textColor,
                fontFamily: 'Arial',
                fontSize: 35,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                textAlign: 'center'
              }}>
                Upcoming Stations
             
              </Text>
              <Text style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 25,
                      paddingVertical: 6,
                      paddingHorizontal: 16,
                      marginVertical: 6,
                      marginHorizontal: 12,
                      borderRadius: 16,
                      fontWeight: 'bold',
                      backgroundColor: 
                        nearestTrain?.LINE.toLowerCase() === 'red' ? '#D32F2F' :
                        nearestTrain?.LINE.toLowerCase() === 'gold' ? '#FFD700' :
                        nearestTrain?.LINE.toLowerCase() === 'blue' ? '#1976D2' :
                        nearestTrain?.LINE.toLowerCase() === 'green' ? '#388E3C' :
                        '#808080',
                      borderWidth: 3,
                      borderColor: 
                        nearestTrain?.LINE.toLowerCase() === 'red' ? '#D32F2F' :
                        nearestTrain?.LINE.toLowerCase() === 'gold' ? '#FFD700' :
                        nearestTrain?.LINE.toLowerCase() === 'blue' ? '#1976D2' :
                        nearestTrain?.LINE.toLowerCase() === 'green' ? '#388E3C' :
                        '#808080',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.15,
                      shadowRadius: 3,
                      elevation: 2,
                      textShadowRadius: 10,
                      textShadowOffset: { width: 5, height: 5 },
                      overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
              }}>
                  {nearestTrain?.DESTINATION + ' Station'}
                </Text>

                <BottomSheetFlatList
                  data={allData.filter(t => t.TRAIN_ID === nearestTrain?.TRAIN_ID)}
                  keyExtractor={(_: any, index: { toString: () => any; }) => index.toString()}
                  renderItem={({ item }: { item: Train }) => (
                    <Pressable
                      onPress={() => focusOn(parseFloat(item.LATITUDE), parseFloat(item.LONGITUDE))}
                    >
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 6,
                          paddingHorizontal: 16,
                          marginVertical: 6,
                          marginHorizontal: 12,
                          borderRadius: 16,
                          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                          borderWidth: 3,
                          borderColor:
                            item.LINE.toLowerCase() === 'red' ? '#D32F2F' :
                            item.LINE.toLowerCase() === 'gold' ? '#FFD700' :
                            item.LINE.toLowerCase() === 'blue' ? '#1976D2' :
                            item.LINE.toLowerCase() === 'green' ? '#388E3C' :
                            '#808080',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.15,
                          shadowRadius: 3,
                          elevation: 2,
                          overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
                        }}
                      >
                        <Text style={{
                          color: isDark ? '#FFF' : '#000',
                          fontFamily: 'Arial',
                          fontSize: 25,
                          fontWeight: 'bold',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor:
                            item.LINE.toLowerCase() === 'red' ? '#D32F2F' :
                            item.LINE.toLowerCase() === 'gold' ? '#FFD700' :
                            item.LINE.toLowerCase() === 'blue' ? '#1976D2' :
                            item.LINE.toLowerCase() === 'green' ? '#388E3C' :
                            '#808080',
                          textShadowRadius: 10,
                          textShadowOffset: { width: 5, height: 5 }
                        }}>
                          {item.LINE.charAt(0) + item.LINE.toLowerCase().slice(1, item.LINE.length)}
                        </Text>
                        <Text style={{
                          color: isDark ? '#FFF' : '#000',
                          fontFamily: 'Arial',
                          fontSize: 25,
                          fontWeight: 'bold',
                          backgroundColor: 'transparent',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}>
                          {item.STATION}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{    
                            color: isDark ? '#FFF' : '#000',
                            fontFamily: 'Arial',
                            fontSize: 20,
                            fontWeight: '600',
                            backgroundColor: 'transparent',
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            borderRadius: 4
                          }}>
                          {parseInt(item.WAITING_SECONDS) < 60 ? `${item.WAITING_SECONDS}s` : `${item.WAITING_TIME}`}
                          </Text>

                          {item.IS_REALTIME === "true" && (
                            <Ionicons
                              name={"radio"}
                              size={25}
                              color={isDark ? '#FFF' : '#000'}
                              style={{ marginRight: 8 , paddingHorizontal: 2}}
                            />
                          )}
                        </View>
                      </View>
                    </Pressable>
                )}
                  contentContainerStyle={{ paddingBottom: insets.bottom + 250 }}
                  ListEmptyComponent={
                    <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black',
                            width: '100%',
                          }}
                    >
                      <Text style={{    
                          color: 'white',
                          fontFamily: 'Arial',
                          fontSize: 20,
                          fontWeight: '600',
                          backgroundColor: '#000',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                      }}
                      >
                        No trains found for this station.
                      </Text>
                    </View>
                      }
                />
              </View>
            ) :
            selectedTransport === 'Buses' ? (
              <View style={{backgroundColor: isDark ? '#000' : '#F2F2F6', flex: 1, alignContent:'center'}}>
                <Text style={{color: textColor, textAlign: 'center'}}>insert bus stuff here</Text>
              </View>
            ) :
            selectedTransport ==='Streetcar' ? (
              <View style={{backgroundColor: isDark ? '#000' : '#F2F2F6', flex: 1, alignContent:'center'}}>
                <Text style={{color: textColor, textAlign: 'center'}}>insert streetcar stuff or something else here</Text>
              </View>
            ) : null}
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    flex: 1
  },
  markerText: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 4,
  },
    contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
