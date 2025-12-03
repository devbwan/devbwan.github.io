const { withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to add Google Maps API key to AndroidManifest.xml
 * This ensures the API key is preserved even after running `expo prebuild`
 * 
 * Maps API Key는 Firebase API Key와 동일한 값을 사용합니다.
 * google-services.json 파일에서 직접 가져옵니다 (가장 신뢰할 수 있는 소스).
 * 환경 변수 EXPO_PUBLIC_FIREBASE_API_KEY는 대체(fallback)로 사용됩니다.
 */
const getApiKeyFromGoogleServices = () => {
  const googleServicesPath = path.join(process.cwd(), 'google-services.json');
  
  if (fs.existsSync(googleServicesPath)) {
    try {
      const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
      const apiKey = googleServices?.client?.[0]?.api_key?.[0]?.current_key;
      if (apiKey) {
        console.log('[Google Maps Plugin] google-services.json에서 API Key를 읽었습니다.');
        return apiKey;
      }
    } catch (error) {
      console.warn('[Google Maps Plugin] google-services.json 파일을 읽는 중 오류:', error.message);
    }
  }
  
  return null;
};

const withGoogleMapsApiKey = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest.application) {
      return config;
    }

    // Firebase API Key를 Maps API Key로 사용
    // 1순위: google-services.json에서 가져오기 (가장 신뢰할 수 있는 소스)
    // 2순위: 환경 변수에서 가져오기
    let mapsApiKey = getApiKeyFromGoogleServices();
    
    if (!mapsApiKey) {
      mapsApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
      if (mapsApiKey) {
        console.log('[Google Maps Plugin] 환경 변수에서 API Key를 읽었습니다.');
      }
    }

    if (!mapsApiKey) {
      console.warn('[Google Maps Plugin] API Key를 찾을 수 없습니다.');
      console.warn('[Google Maps Plugin] google-services.json 파일 또는 .env.android 파일에 EXPO_PUBLIC_FIREBASE_API_KEY를 확인하세요.');
      return config;
    }

    const application = manifest.application[0];
    
    // Check if API key meta-data already exists
    const existingApiKey = application['meta-data']?.find(
      (meta) => meta.$['android:name'] === 'com.google.android.geo.API_KEY'
    );

    if (!existingApiKey) {
      // Add Google Maps API key meta-data
      if (!application['meta-data']) {
        application['meta-data'] = [];
      }

      application['meta-data'].push({
        $: {
          'android:name': 'com.google.android.geo.API_KEY',
          'android:value': mapsApiKey,
        },
      });

      console.log('[Google Maps Plugin] Google Maps API Key가 AndroidManifest.xml에 추가되었습니다.');
      console.log('[Google Maps Plugin] API Key:', mapsApiKey.substring(0, 20) + '...');
    } else {
      // 기존 API Key 업데이트
      existingApiKey.$['android:value'] = mapsApiKey;
      console.log('[Google Maps Plugin] Google Maps API Key가 업데이트되었습니다.');
      console.log('[Google Maps Plugin] API Key:', mapsApiKey.substring(0, 20) + '...');
    }

    return config;
  });
};

module.exports = withGoogleMapsApiKey;

