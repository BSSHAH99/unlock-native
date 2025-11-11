import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PinPad from './components/PinPad';
import { useSettings } from './hooks/useSettings';

export default function PinScreen() {
  const router = useRouter();
  const { settings, bumpFail, resetFails, addAttempt, clearAttempts } =
    useSettings();
  const [value, setValue] = useState('');

  const remain = Math.max(0, settings.maxAttempts - (settings.failCount || 0));

  const onKey = async (digit: string) => {
    if (digit === '<-') {
      setValue(v => v.slice(0, -1));
      return;
    }

    if (digit === 'ok') {
      if (!value) return;

      // store entered PIN attempt
      addAttempt(value);

      const fails = await bumpFail();

      // Unlock after Nth attempt
      if (fails === settings.maxAttempts) {
        resetFails();
        router.replace({ pathname: '/home', params: { mode: 'normal' } });
        return;
      }

      setValue('');
      return;
    }

    setValue(v => (v + digit).slice(0, 10));
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
        style={pstyles.bg}
        resizeMode="cover"
      >
        <View style={pstyles.dim}>
          <View style={pstyles.header}>
            <Text style={pstyles.title}>Enter PIN</Text>
            <Text style={pstyles.sub}>Attempts left: {remain}</Text>
            <View style={{ height: 20 }} />
            <View style={pstyles.dotsRow}>
              {new Array(6).fill(0).map((_, i) => (
                <View
                  key={i}
                  style={[pstyles.dot, i < value.length && pstyles.dotFilled]}
                />
              ))}
            </View>
          </View>

          <View style={pstyles.padWrapper}>
            <PinPad onKey={onKey} />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const pstyles = StyleSheet.create({
  bg: { flex: 1 },
  dim: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 50,
  },
  header: { alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: '600' },
  sub: { color: '#eee', marginTop: 6 },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.75,
  },
  dotFilled: { backgroundColor: 'white', opacity: 0.95 },
  padWrapper: { width: '100%', marginBottom: 20 },
});
