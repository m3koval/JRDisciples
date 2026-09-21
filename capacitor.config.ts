import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.juniordisciples.app',
  appName: 'Junior Disciples',
  webDir: 'out',
  backgroundColor: '#0b1f3a',
  zoomEnabled: false,
  initialFocus: false,
  ios: {
    allowsLinkPreview: false,
    contentInset: 'never',
    loggingBehavior: 'debug',
  },
};

export default config;
