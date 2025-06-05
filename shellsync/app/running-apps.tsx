import { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSystemData } from './hooks/useSystemData';
import AppListItem from './components/AppListItem';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { AppInfo } from './types/api';

export default function RunningAppsScreen() {
  const {
    apps,
    isLoadingApps,
    errorApps,
    killApp,
    refreshAll,
  } = useSystemData();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleKillAction = useCallback(async (pid: number) => {
    try {
      const result = await killApp(pid);
      Alert.alert(
        result.success ? 'Success' : 'Error',
        result.message || (result.success ? `Process ${pid} terminated.` : `Failed to kill ${pid}.`)
      );
      if (result.success) {

      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred while killing the process.');
    }
  }, [killApp]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshAll();
    setIsRefreshing(false);
  }, [refreshAll]);

  const renderAppItem = ({ item }: { item: AppInfo }) => (
    <AppListItem
      app={item}
      onKill={() => handleKillAction(item.pid)}
    />
  );

  if (isLoadingApps && apps.length === 0 && !errorApps && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-900">
        <Stack.Screen options={{ title: 'Running Apps', headerTintColor: '#e5e5e5', headerStyle: { backgroundColor: '#171717' } }} />
        <View className="flex-1 justify-center items-center">
          <LoadingSpinner text="Loading running applications..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F2F2F2' }}>
      <Stack.Screen options={{ title: 'Running Apps', headerTintColor: '#e5e5e5', headerStyle: { backgroundColor: '#171717' } }} />

      {errorApps && !isRefreshing && apps.length === 0 && (
        <View className="p-4">
          <ErrorDisplay
            message={errorApps.message || "Could not load running applications."}
            onRetry={onRefresh}
          />
        </View>
      )}

      {apps.length === 0 && !isLoadingApps && !errorApps && (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-neutral-400 text-lg text-center mb-2">No running applications found.</Text>
          <Text className="text-neutral-500 text-sm text-center">Pull down to refresh the list.</Text>
        </View>
      )}

      {apps.length > 0 && (
        <FlatList
          data={apps}
          renderItem={renderAppItem}
          keyExtractor={(item) => item.pid.toString()}
          className="p-4"
          contentContainerStyle={apps.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : { paddingBottom: 16 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} progressBackgroundColor="#27272a" />}
          ListHeaderComponent={
            errorApps && isRefreshing ? (
              <View className="mb-4">
                <ErrorDisplay message={errorApps.message || "Failed to refresh applications."} onRetry={onRefresh} />
              </View>
            ) : null
          }
        />
      )}
      {apps.length === 0 && !isLoadingApps && !errorApps && (
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} progressBackgroundColor="#27272a" />}
        >
          <View className="flex-1 justify-center items-center">
            <Text className="text-neutral-400 text-lg text-center mb-2">No running applications found.</Text>
            <Text className="text-neutral-500 text-sm text-center">Pull down to refresh the list.</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}