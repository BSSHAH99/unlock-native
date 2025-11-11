import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from './hooks/useSettings';

export default function Home() {
  const router = useRouter();
  const { settings, clearAttempts } = useSettings();
  const [revealed, setRevealed] = useState(false);

  const img = settings.desktop1Uri;
  const peekIndex = settings.peekPin ? parseInt(settings.peekPin, 10) - 1 : -1;
  const peekValue =
    peekIndex >= 0 && peekIndex < (settings.attemptHistory || []).length
      ? settings.attemptHistory[peekIndex]
      : 'N/A';

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
          <Text style={styles.peekText}>Peek Password: {peekValue}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 10,
    borderRadius: 8,
  },
  peekText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
