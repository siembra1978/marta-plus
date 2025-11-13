import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import MapView, { Marker } from 'react-native-maps';
import * as GtfsRealtime from "../../assets/misc/gtfs-realtime.js";

export const unstable_settings = {
  anchor: '(screens)',
};

export default function BusTracking() {
  const [buses, setBuses] = useState<any[]>([]);

  async function getBuses() {
    const response = await fetch(
      'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/VehiclePositions.pb'
    );
    const buffer = await response.arrayBuffer();
    const message = GtfsRealtime.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    const data = GtfsRealtime.transit_realtime.FeedMessage.toObject(message, { longs: String });
    setBuses(data.entity);
  }

  useEffect(() => {
    getBuses();
    const interval = setInterval(getBuses, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      //provider="google"
      initialRegion={{
        latitude: 33.749,
        longitude: -84.388,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }}
    >
      {buses.map((bus) => {
        const pos = bus.vehicle?.position;
        if (!pos) return null;
        return (
          <Marker
            key={bus.id}
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            title={`Bus ${bus.id}`}
          />
        );
      })}
    </MapView>
  );
}