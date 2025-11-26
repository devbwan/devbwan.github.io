import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export function useLocationPermission() {
  const [granted, setGranted] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { status: s } = await Location.requestForegroundPermissionsAsync();
        setStatus(s);
        setGranted(s === 'granted');
      } catch (error) {
        console.error('[LocationPermission] 권한 요청 오류:', error);
        setStatus('undetermined');
        setGranted(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { granted, status, loading };
}


