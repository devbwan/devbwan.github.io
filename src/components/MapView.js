import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';

export function RunMapView({ route = [], currentLocation = null, initialLocation = null }) {
  const mapRef = useRef(null);
  const [region, setRegion] = React.useState(null);

  // 초기 region 계산
  React.useEffect(() => {
    if (route.length > 0) {
      const first = route[0];
      setRegion({
        latitude: first.lat,
        longitude: first.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else if (initialLocation) {
      setRegion({
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      // 서울 기본 위치
      setRegion({
        latitude: 37.5665,
        longitude: 126.978,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [route, initialLocation]);

  useEffect(() => {
    if (route.length > 0 && mapRef.current) {
      // 경로가 모두 보이도록 영역 조정
      const coordinates = route.map((p) => ({
        latitude: p.lat,
        longitude: p.lng,
      }));

      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } else if (initialLocation && mapRef.current && route.length === 0) {
      // 경로가 없고 초기 위치가 있으면 현재 위치로 지도 이동
      const newRegion = {
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 500);
    }
  }, [route, initialLocation]);

  if (!region) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        region={region}
        showsUserLocation={!!currentLocation}
        showsMyLocationButton={false}
        followsUserLocation={!!currentLocation && !route.length}
        loadingEnabled={true}
      >
        {route.length > 1 && (
          <Polyline
            coordinates={route.map((p) => ({
              latitude: p.lat,
              longitude: p.lng,
            }))}
            strokeColor="#00D9FF"
            strokeWidth={4}
          />
        )}
        {route.length > 0 && (
          <>
            <Marker
              coordinate={{
                latitude: route[0].lat,
                longitude: route[0].lng,
              }}
              title="시작점"
              pinColor="green"
            />
            <Marker
              coordinate={{
                latitude: route[route.length - 1].lat,
                longitude: route[route.length - 1].lng,
              }}
              title="종료점"
              pinColor="red"
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
