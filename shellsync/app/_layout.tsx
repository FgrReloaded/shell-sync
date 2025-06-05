import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-dark-950">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
          animation: 'slide_from_right',
        }}
      />
      <StatusBar style="light" backgroundColor="green" />
    </SafeAreaView>
  );
}
