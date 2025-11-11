import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from './hooks/useSettings';

export default function Home() {
  const router = useRouter();
  const { settings, clearAttempts } = useSettings();
  const [revealed, setRevealed] = useState(false);

  const img = settings.desktop1Uri;

  // --- Compute which attempt to show ---
  const peekIndex = useMemo(() => {
    const peekNumber = parseInt(settings.peekPin || '0', 10);
    if (!peekNumber || peekNumber < 1) return -1;
    return peekNumber - 1; // convert 1-based to 0-based index
  }, [settings.peekPin]);

  const peekValue = useMemo(() => {
    const history = settings.attemptHistory || [];
    if (peekIndex >= 0 && peekIndex < history.length) {
      return history[peekIndex];
    }
    return '—'; // nothing yet
  }, [peekIndex, settings.attemptHistory]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {img ? (
        <Image source={{ uri: img }} style={{ flex: 1, resizeMode: 'cover' }} />
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Long press bottom-right to reveal peek password */}
      <Pressable
        onLongPress={() => setRevealed(true)}
        onPressOut={() => setRevealed(false)}
        style={styles.revealZone}
      />

      {revealed && (
        <View style={styles.peekBox}>
          <Text style={styles.peekText}>
            Peek Password:{' '}
            <Text style={{ fontWeight: '700', color: '#4ade80' }}>
              {peekValue}
            </Text>
          </Text>
        </View>
      )}

      {/* Tap top to lock again */}
      <Pressable
        style={styles.lockZone}
        onPress={() => {
          clearAttempts();
          router.replace('/');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, backgroundColor: '#111' },
  revealZone: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 120,
    height: 120,
  },
  lockZone: { position: 'absolute', left: 0, top: 0, right: 0, height: 48 },
  peekBox: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
  },
  peekText: { color: 'white', fontSize: 16 },
});
