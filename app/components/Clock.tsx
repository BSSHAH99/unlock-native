import React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

export default function Clock({
  is24h,
  styleTime,
  styleDate,
}: {
  is24h: boolean;
  styleTime?: StyleProp<TextStyle>;
  styleDate?: StyleProp<TextStyle>;
}) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hours = now.getHours();
  const mins = now.getMinutes();
  const hh = is24h ? hours : ((hours + 11) % 12) + 1;
  const mm = mins.toString().padStart(2, '0');
  const ampm = is24h ? '' : hours >= 12 ? ' PM' : ' AM';
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return (
    <View>
      <Text style={[{ color: 'white' }, styleTime]}>{`${hh
        .toString()
        .padStart(2, '0')}:${mm}${ampm}`}</Text>
      <Text style={[{ color: 'white', opacity: 0.85 }, styleDate]}>
        {dateStr}
      </Text>
    </View>
  );
}
