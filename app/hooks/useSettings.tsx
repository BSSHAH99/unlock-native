import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ------------------------------
// 🔧 Types
// ------------------------------
export type Settings = {
  pin: string;
  peekPin?: string;
  maxAttempts: number;
  is24h: boolean;
  lockImageUri?: string;
  desktop1Uri?: string;
  desktop2Uri?: string;
  failCount: number;
  attemptHistory: string[]; // 👈 new: store user-entered PINs
};

// ------------------------------
// 🧱 Default settings
// ------------------------------
const defaultSettings: Settings = {
  pin: '0000',
  peekPin: undefined,
  maxAttempts: 3,
  is24h: true,
  lockImageUri: undefined,
  desktop1Uri: undefined,
  desktop2Uri: undefined,
  failCount: 0,
  attemptHistory: [],
};

const STORAGE_KEY = 'magician.lock.settings.v1';

// ------------------------------
// 📦 Context Setup
// ------------------------------
type SettingsContextType = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  bumpFail: () => Promise<number>;
  resetFails: () => void;
  addAttempt: (pin: string) => void;
  clearAttempts: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// ------------------------------
// ⚙️ Provider Component
// ------------------------------
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      } catch (error) {
        console.error('⚠️ Failed to load settings:', error);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(err =>
        console.error('⚠️ Failed to save settings:', err),
      );
    }
  }, [settings, loaded]);

  const update = (patch: Partial<Settings>) =>
    setSettings(prev => ({ ...prev, ...patch }));

  const bumpFail = async () => {
    const next = settings.failCount + 1;
    setSettings(prev => ({ ...prev, failCount: next }));
    return next;
  };

  const resetFails = () => {
    setSettings(prev => ({ ...prev, failCount: 0 }));
  };

  const addAttempt = (pin: string) => {
    setSettings(prev => ({
      ...prev,
      attemptHistory: [...(prev.attemptHistory || []), pin],
    }));
  };

  const clearAttempts = () => {
    setSettings(prev => ({ ...prev, attemptHistory: [] }));
  };

  const value = useMemo(
    () => ({
      settings,
      update,
      bumpFail,
      resetFails,
      addAttempt,
      clearAttempts,
    }),
    [settings],
  );

  if (!loaded) return null;
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// ------------------------------
// 🪄 Hook
// ------------------------------
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error('useSettings must be used inside a <SettingsProvider>');
  return ctx;
}
