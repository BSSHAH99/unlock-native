// File: app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
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
  const gestureActive = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate clock and lock fade-in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -10,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, []);

  const onGesture = ({ nativeEvent }: any) => {
    if (gestureActive.current) return;
    if (nativeEvent.state === State.END) {
      gestureActive.current = true;
      if (nativeEvent.translationY < -60) {
        router.push('/pin');
      }
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
    <PanGestureHandler onHandlerStateChange={onGesture}>
      <View style={styles.container}>
        <ImageBackground
          source={
            settings.lockImageUri
              ? { uri: settings.lockImageUri }
              : require('../assets/images/lock-fallback.png')
          }
          style={styles.bg}
          resizeMode="cover"
        >
          {/* Main lock screen UI */}
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            {/* Clock */}
            <View style={styles.clockWrap}>
              <Clock
                is24h={settings.is24h}
                styleTime={styles.time}
                styleDate={styles.date}
              />
              <Text style={styles.weatherText}>☁️ 15°C · Wed, Apr 24</Text>
            </View>

            {/* Center lock icon */}
            <Animated.View
              style={[styles.lockCircle, { transform: [{ translateY }] }]}
            >
              <Pressable
                onLongPress={() => router.push('/settings')}
                onPress={() => router.push('/pin')}
                style={styles.lockButton}
              >
                <Ionicons name="lock-closed-outline" size={28} color="#fff" />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ImageBackground>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 90,
  },
  clockWrap: {
    alignItems: 'center',
    marginTop: 80,
  },
  time: {
    fontSize: 100,
    fontWeight: '200',
    letterSpacing: -3,
    color: 'white',
  },
  date: {
    marginTop: 4,
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
  },
  weatherText: {
    marginTop: 8,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
  },
  lockCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: 90,
    height: 90,
    borderRadius: 45,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  lockButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
