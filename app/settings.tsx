import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSettings } from './hooks/useSettings';

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.row}>
      <Text style={s.rowTitle}>{title}</Text>
      <View style={{ flex: 1 }} />
      {children}
    </View>
  );
}

export default function Settings() {
  const { settings, update } = useSettings();
  const router = useRouter();
  const [peekPin, setPeekPin] = useState(settings.peekPin || '');
  const [attempts, setAttempts] = useState(String(settings.maxAttempts));

  const pick = async (
    field: 'lockImageUri' | 'desktop1Uri' | 'desktop2Uri',
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled) {
      update({ [field]: res.assets[0].uri } as any);
    }
  };

  return (
    <ScrollView style={s.wrap} contentContainerStyle={{ padding: 18 }}>
      <Text style={s.h1}>Settings</Text>

      <View style={s.card}>
        <Text style={s.h2}>Appearance</Text>
        <Row title="Lockscreen background">
          <Pressable style={s.thumbBtn} onPress={() => pick('lockImageUri')}>
            {settings.lockImageUri ? (
              <Image source={{ uri: settings.lockImageUri }} style={s.thumb} />
            ) : (
              <Text>Pick</Text>
            )}
          </Pressable>
        </Row>
        <Row title="Desktop image 1">
          <Pressable style={s.thumbBtn} onPress={() => pick('desktop1Uri')}>
            {settings.desktop1Uri ? (
              <Image source={{ uri: settings.desktop1Uri }} style={s.thumb} />
            ) : (
              <Text>Pick</Text>
            )}
          </Pressable>
        </Row>
        <Row title="Desktop image 2">
          <Pressable style={s.thumbBtn} onPress={() => pick('desktop2Uri')}>
            {settings.desktop2Uri ? (
              <Image source={{ uri: settings.desktop2Uri }} style={s.thumb} />
            ) : (
              <Text>Pick</Text>
            )}
          </Pressable>
        </Row>
      </View>

      <View style={s.card}>
        <Text style={s.h2}>Magic Logic</Text>
        <Row title="Unlock attempts">
          <TextInput
            value={attempts}
            onChangeText={setAttempts}
            keyboardType="number-pad"
            style={s.input}
          />
        </Row>
        <Row title="Peek PIN (secret)">
          <TextInput
            value={peekPin}
            onChangeText={setPeekPin}
            keyboardType="number-pad"
            secureTextEntry
            style={s.input}
            placeholder="e.g. 222"
          />
        </Row>
      </View>

      <Pressable
        onPress={() => {
          const maxAttempts = Math.max(1, parseInt(attempts || '3', 10));
          update({
            maxAttempts,
            peekPin: peekPin || undefined,
          });
          router.back();
        }}
        style={s.save}
      >
        <Text style={s.saveTxt}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#0b0f14' },
  h1: { color: 'white', fontSize: 28, fontWeight: '700' },
  h2: { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  card: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowTitle: { color: '#cbd5e1', fontSize: 16 },
  input: {
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white',
  },
  thumbBtn: {
    width: 80,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  thumb: { width: 78, height: 46, borderRadius: 10 },
  save: {
    marginTop: 18,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveTxt: { color: 'white', fontSize: 16, fontWeight: '700' },
});
