import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';

export function RunMapView({ route = [], currentLocation = null, initialLocation = null }) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = React.useState(false);
  const [mapError, setMapError] = React.useState(null);
  
  // 기본 위치(서울)로 초기화
  const [region, setRegion] = React.useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // 컴포넌트 마운트 시 로그
  React.useEffect(() => {
    if (__DEV__) {
      console.log('[MapView] 컴포넌트 마운트됨', {
        hasRoute: route.length > 0,
        hasInitialLocation: !!initialLocation,
        hasCurrentLocation: !!currentLocation,
        region,
      });
    }
  }, []);

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
      // 서울 기본 위치 (즉시 설정)
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

  return (
    <View style={styles.container}>
      {mapError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            지도 로드 오류: {mapError?.message || '알 수 없는 오류'}
          </Text>
        </View>
      )}
      {!mapReady && !mapError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>지도를 불러오는 중...</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={[styles.map, !mapReady && styles.mapHidden]}
        provider="google"
        initialRegion={region}
        region={region}
        showsUserLocation={!!currentLocation}
        showsMyLocationButton={false}
        followsUserLocation={!!currentLocation && !route.length}
        loadingEnabled={true}
        onMapReady={() => {
          setMapReady(true);
          setMapError(null);
          if (__DEV__) {
            console.log('[MapView] 지도가 준비되었습니다.', { region });
          }
        }}
        onError={(error) => {
          setMapError(error);
          console.error('[MapView] 지도 오류:', error);
          if (__DEV__) {
            console.error('[MapView] 오류 상세:', {
              message: error?.message,
              nativeEvent: error?.nativeEvent,
            });
          }
        }}
        onLoad={() => {
          if (__DEV__) {
            console.log('[MapView] 지도 로드 완료');
          }
        }}
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
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  mapHidden: {
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#ffebee',
    zIndex: 2,
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
  },
});
