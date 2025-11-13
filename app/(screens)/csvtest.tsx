import React, { useMemo } from 'react';
import { View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import shapesRaw from '../../assets/transit_info/shapes.json';

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
  BLUE: '#007AFF',
  GREEN: '#34C759',
  RED: '#FF3B30',
  GOLD: '#FFD700',
};

export default function CsvTest() {
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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 33.749,
          longitude: -84.388,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {Object.keys(lineCoords).map((lineName) => (
          <Polyline
            key={lineName}
            coordinates={lineCoords[lineName]}
            strokeColor={lineColors[lineName]}
            strokeWidth={4}
          />
        ))}
      </MapView>
    </View>
  );
}
