import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; // Ensure NativeWind styles are picked up
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-neutral-900 text-neutral-100">
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
