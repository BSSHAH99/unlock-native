// File: app/index.tsx
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Clock from './components/Clock';
import { useSettings } from './hooks/useSettings';

export default function LockScreen() {
  const router = useRouter();
  const { settings } = useSettings();
  const gestureActive = useRef(false); // prevents multiple triggers

  const onGesture = ({ nativeEvent }: any) => {
    // ignore if already triggered
    if (gestureActive.current) return;

    // detect gesture end
    if (nativeEvent.state === State.END) {
      gestureActive.current = true;

      // swipe up (single finger) → open PIN
      if (nativeEvent.translationY < -80) {
        router.push('/pin');
      }

      // reset trigger after short delay
      setTimeout(() => (gestureActive.current = false), 500);
    }
  };

  useFocusEffect(
    useCallback(() => {
      gestureActive.current = false;
      return () => {};
    }, []),
  );

  return (
    <PanGestureHandler
      onHandlerStateChange={onGesture}
      minPointers={1}
      maxPointers={1}
    >
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={
            settings.lockImageUri
              ? { uri: settings.lockImageUri }
              : require('../assets/images/lock-fallback.png')
          }
          style={styles.bg}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            {/* Pressable around the clock for long-press secret access */}
            <Pressable
              onLongPress={() => router.push('/settings')}
              delayLongPress={1000} // must hold for 1 second
              style={{ alignItems: 'center' }}
            >
              <Clock
                is24h={settings.is24h}
                styleTime={styles.time}
                styleDate={styles.date}
              />
            </Pressable>

            <Text style={styles.hint}>Swipe up to unlock</Text>
          </View>
        </ImageBackground>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'space-between' },
  overlay: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  time: {
    fontSize: 120,
    fontWeight: '600',
    letterSpacing: -4,
    color: 'white',
  },
  date: { marginTop: 8, fontSize: 18, color: 'white', opacity: 0.9 },
  hint: { textAlign: 'center', color: 'white', opacity: 0.8 },
});
