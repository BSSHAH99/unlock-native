import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import PinPad from './components/PinPad';
import { useSettings } from './hooks/useSettings';

export default function PinScreen() {
  const router = useRouter();
  const { settings, bumpFail, resetFails, addAttempt } = useSettings();
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [tempLength, setTempLength] = useState(settings.passwordLength || 6);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const remain = Math.max(0, settings.maxAttempts - (settings.failCount || 0));

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onKey = async (digit: string) => {
    if (digit === '<-') {
      setValue(v => v.slice(0, -1));
      return;
    }

    const newValue = (value + digit).slice(0, tempLength);
    setValue(newValue);

    if (newValue.length === tempLength) {
      addAttempt(newValue);

      const fails = await bumpFail();
      if (fails === settings.maxAttempts) {
        resetFails();
        router.replace({ pathname: '/home', params: { mode: 'normal' } });
        return;
      }

      setWrong(true);
      shake();
      Vibration.vibrate(60);
      setTimeout(() => {
        setWrong(false);
        setValue('');
      }, 600);
    }
  };

  // 🆘 Emergency long-press toggle (4 ↔ 6 digits)
  const onEmergencyLongPress = () => {
    const newLen = tempLength === 4 ? 6 : 4;
    setTempLength(newLen);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <View style={styles.gradient} />

          <Animated.View
            style={[styles.header, { transform: [{ translateX: shakeAnim }] }]}
          >
            <Text style={[styles.title, wrong && { color: '#ff6b6b' }]}>
              {wrong ? 'Wrong PIN' : 'Enter PIN'}
            </Text>
            {!wrong && <Text style={styles.sub}>Attempts left: {remain}</Text>}

            <View style={{ height: 30 }} />
            <View style={styles.dotsRow}>
              {new Array(tempLength).fill(0).map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i < value.length && styles.dotFilled]}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.padWrapper, { opacity: fadeAnim }]}>
            <PinPad onKey={onKey} />

            {/* Emergency button with long-press secret */}
            <TouchableOpacity
              onLongPress={onEmergencyLongPress}
              delayLongPress={400}
              style={styles.emergencyBtn}
            >
              <Text style={styles.emergencyTxt}>Emergency call</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  sub: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontSize: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#ccc',
    opacity: 0.5,
  },
  dotFilled: {
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  padWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  emergencyBtn: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTxt: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
  },
});
