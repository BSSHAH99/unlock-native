// File: app/settings.tsx
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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
  const [is24h, setIs24h] = useState(settings.is24h);
  const [passwordLength, setPasswordLength] = useState(
    settings.passwordLength || 6,
  );

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
    <ScrollView style={s.wrap} contentContainerStyle={{ padding: 20 }}>
      <Text style={s.h1}>Settings</Text>
      <Text style={s.subtitle}>
        Configure your magician’s smart lock system
      </Text>

      {/* ------------------ Appearance ------------------ */}
      <View style={s.card}>
        <Text style={s.h2}>Appearance</Text>
        <Row title="Lockscreen background">
          <Pressable style={s.thumbBtn} onPress={() => pick('lockImageUri')}>
            {settings.lockImageUri ? (
              <Image source={{ uri: settings.lockImageUri }} style={s.thumb} />
            ) : (
              <Text style={s.pickTxt}>Select</Text>
            )}
          </Pressable>
        </Row>
        <Row title="Desktop image 1">
          <Pressable style={s.thumbBtn} onPress={() => pick('desktop1Uri')}>
            {settings.desktop1Uri ? (
              <Image source={{ uri: settings.desktop1Uri }} style={s.thumb} />
            ) : (
              <Text style={s.pickTxt}>Select</Text>
            )}
          </Pressable>
        </Row>
        <Row title="Desktop image 2">
          <Pressable style={s.thumbBtn} onPress={() => pick('desktop2Uri')}>
            {settings.desktop2Uri ? (
              <Image source={{ uri: settings.desktop2Uri }} style={s.thumb} />
            ) : (
              <Text style={s.pickTxt}>Select</Text>
            )}
          </Pressable>
        </Row>
      </View>

      {/* ------------------ Magic Logic ------------------ */}
      <View style={s.card}>
        <Text style={s.h2}>Magic Logic</Text>
        <Row title="Unlock attempts">
          <TextInput
            value={attempts}
            onChangeText={setAttempts}
            keyboardType="number-pad"
            style={s.input}
            placeholder="3"
            placeholderTextColor="#999"
          />
        </Row>
        <Row title="Peek attempt (secret)">
          <TextInput
            value={peekPin}
            onChangeText={setPeekPin}
            keyboardType="number-pad"
            secureTextEntry
            style={s.input}
            placeholder="2"
            placeholderTextColor="#999"
          />
        </Row>
      </View>

      {/* ------------------ Clock ------------------ */}
      <View style={s.card}>
        <Text style={s.h2}>Clock Format</Text>
        <Row title="24-hour time">
          <Switch
            value={is24h}
            onValueChange={setIs24h}
            thumbColor={is24h ? '#2563eb' : '#64748b'}
            trackColor={{ true: '#2563eb', false: '#1e293b' }}
          />
        </Row>
      </View>

      {/* ------------------ Security ------------------ */}
      <View style={s.card}>
        <Text style={s.h2}>Password Length</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
          {[4, 6].map(len => (
            <Pressable
              key={len}
              style={[s.optionBtn, passwordLength === len && s.optionActive]}
              onPress={() => setPasswordLength(len)}
            >
              <Text
                style={[
                  s.optionTxt,
                  passwordLength === len && { color: '#fff' },
                ]}
              >
                {len} digits
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ------------------ Save ------------------ */}
      <Pressable
        onPress={() => {
          const maxAttempts = Math.max(1, parseInt(attempts || '3', 10));
          update({
            maxAttempts,
            peekPin: peekPin || undefined,
            is24h,
            passwordLength,
          });
          router.back();
        }}
        style={s.save}
      >
        <Text style={s.saveTxt}>Save Settings</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#0b0f14',
  },
  h1: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  h2: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'rgba(30,41,59,0.7)',
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowTitle: { color: '#cbd5e1', fontSize: 16, fontWeight: '500' },
  input: {
    minWidth: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  thumbBtn: {
    width: 80,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pickTxt: { color: '#60a5fa', fontSize: 14, fontWeight: '600' },
  thumb: { width: 78, height: 46, borderRadius: 10 },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  optionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  optionTxt: { color: '#ccc', fontSize: 15 },
  save: {
    marginTop: 28,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
