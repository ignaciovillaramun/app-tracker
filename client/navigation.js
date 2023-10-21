import React from 'react';
import { AuthProvider } from './src/context/auth';
import ScreensNav from './src/components/nav/ScreensNav';

export default function RootNavigation() {
  return (
    <AuthProvider>
      <ScreensNav />
    </AuthProvider>
  );
}
