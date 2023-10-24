import React from 'react';
import { AuthProvider } from './src/context/auth';
import ScreensNav from './src/components/nav/ScreensNav';
import { LocationProvider } from './src/context/LocationContext';

export default function RootNavigation() {
  return (
    <AuthProvider>
      <LocationProvider>
        <ScreensNav />
      </LocationProvider>
    </AuthProvider>
  );
}
