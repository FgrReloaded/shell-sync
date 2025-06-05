import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSystemData } from './hooks/useSystemData';
import AppListItem from './components/AppListItem';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ActionButton from './components/ActionButton'; // For a back button if needed, or other actions
import { AppInfo, ActionResult } from './types/api';

export default function RunningAppsScreen() {
  const router = useRouter();
  const {
    apps,
    isLoadingApps,
    errorApps,
    killApp,
    refreshAll,
  } = useSystemData();

  const [isRefreshing, setIsRefreshing] = useState(false);
  // Action states for individual kill buttons, e.g., kill-PID
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});

  const handleKillAction = useCallback(async (pid: number) => {
    const actionName = `kill-${pid}`;
    setActionStates(prev => ({ ...prev, [actionName]: true }));
    try {
      const result = await killApp(pid);
      Alert.alert(
        result.success ? 'Success' : 'Error',
        result.message || (result.success ? `Process ${pid} terminated.` : `Failed to kill ${pid}.`)
      );
      if (result.success) {
        // The useSystemData hook should ideally update the apps list automatically
        // If not, refreshAll() can be called here. Assuming it updates.
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred while killing the process.');
    }
    setActionStates(prev => ({ ...prev, [actionName]: false }));
  }, [killApp]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshAll(); // This should refresh all data, including the apps list
    setIsRefreshing(false);
  }, [refreshAll]);

  const renderAppItem = ({ item }: { item: AppInfo }) => (
    <AppListItem
      app={item}
      onKill={() => handleKillAction(item.pid)}
    // Pass loading state to AppListItem if it supports showing a spinner on the kill button
    // isLoading={actionStates[`kill-${item.pid}`] || false} // Example
    />
  );

  // Loading state for the initial fetch of apps
  // Avoid showing this if a refresh is in progress and there's already data or an error.
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
    <SafeAreaView className="flex-1 bg-neutral-900">
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
          {/* The RefreshControl won't be visible here, so manual refresh button might be good if desired */}
        </View>
      )}

      {apps.length > 0 && (
        <FlatList
          data={apps}
          renderItem={renderAppItem}
          keyExtractor={(item) => item.pid.toString()}
          className="p-4" // Padding for the list container
          contentContainerStyle={apps.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : { paddingBottom: 16 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} progressBackgroundColor="#27272a" />}
          ListHeaderComponent={
            errorApps && isRefreshing ? ( // Show error only if refreshing and error occurs while data is present
              <View className="mb-4">
                <ErrorDisplay message={errorApps.message || "Failed to refresh applications."} onRetry={onRefresh} />
              </View>
            ) : null
          }
        />
      )}
      {/* This provides pull-to-refresh when the list is initially empty and not loading/error */}
      {apps.length === 0 && !isLoadingApps && !errorApps && (
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} progressBackgroundColor="#27272a" />}
        >
          {/* Empty ScrollView for RefreshControl to work when list is empty */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}