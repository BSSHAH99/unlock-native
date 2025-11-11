import { Ionicons } from '@expo/vector-icons';
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
    if (Platform.OS !== 'web') Vibration.vibrate(10);
    onKey(d);
  };

  const Key = ({ label, icon }: { label?: string; icon?: React.ReactNode }) => (
    <TouchableOpacity
      style={[styles.key, disabled && { opacity: 0.4 }]}
      activeOpacity={0.6}
      onPress={() => press(label || '')}
    >
      {icon ? icon : <Text style={styles.keyText}>{label}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ].map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map(n => (
            <Key key={n} label={n} />
          ))}
        </View>
      ))}

      <View style={styles.row}>
        <Key
          label="<-"
          icon={<Ionicons name="backspace-outline" size={26} color="#fff" />}
        />
        <Key label="0" />
        <TouchableOpacity
          style={[styles.key, styles.enterKey]}
          activeOpacity={0.8}
          onPress={() => press('ok')}
        >
          <Ionicons name="arrow-forward" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  keyText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '400',
  },
  enterKey: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
});
