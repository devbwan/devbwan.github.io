const { withAndroidManifest } = require('@expo/config-plugins');

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero';

/**
 * Expo config plugin to add Google Maps API key to AndroidManifest.xml
 * This ensures the API key is preserved even after running `expo prebuild`
 */
const withGoogleMapsApiKey = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest.application) {
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
          'android:value': GOOGLE_MAPS_API_KEY,
        },
      });
    }

    return config;
  });
};

module.exports = withGoogleMapsApiKey;

