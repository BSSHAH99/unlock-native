import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsProvider } from './hooks/useSettings';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
