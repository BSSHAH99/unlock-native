import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

export default function PinPad({
  onKey,
  disabled,
}: {
  onKey: (d: string) => void;
  disabled?: boolean;
}) {
  const press = (d: string) => {
    if (disabled) return;
    if (Platform.OS !== 'web') Vibration.vibrate(10); // subtle haptic feedback
    onKey(d);
  };

  const Row = ({ keys }: { keys: string[] }) => (
    <View style={styles.row}>
      {keys.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.key, disabled && { opacity: 0.4 }]}
          activeOpacity={0.6}
          onPress={() => press(d)}
        >
          <Text
            style={[
              styles.keyText,
              d === 'OK' && { color: '#fff', fontSize: 20, fontWeight: '700' },
            ]}
          >
            {d === '<-' ? '⌫' : d}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Row keys={['1', '2', '3']} />
      <Row keys={['4', '5', '6']} />
      <Row keys={['7', '8', '9']} />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.key, { opacity: disabled ? 0.4 : 1 }]}
          onPress={() => press('<-')}
        >
          <Text style={styles.sub}>⌫</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.key, { opacity: disabled ? 0.4 : 1 }]}
          onPress={() => press('0')}
        >
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.key, styles.okButton]}
          onPress={() => press('ok')}
        >
          <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '75%',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  keyText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '500',
  },
  sub: { color: 'white', fontSize: 22, fontWeight: '400' },
  okButton: {
    backgroundColor: '#1E88E5',
    shadowColor: '#1E88E5',
    shadowOpacity: 0.4,
  },
  okText: { color: 'white', fontSize: 20, fontWeight: '700' },
});
