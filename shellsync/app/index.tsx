import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSystemData } from './hooks/useSystemData';
import Section from './components/Section';
import SystemInfoCard from './components/SystemInfoCard';
import NetworkInfoCard from './components/NetworkInfoCard';
import ActionButton from './components/ActionButton';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { ActionResult } from './types/api';

export default function DashboardScreen() {
  const router = useRouter();
  const {
    systemInfo,
    isLoadingSystemInfo,
    errorSystemInfo,
    refreshAll,
    openApp,
    lockUserScreen,
  } = useSystemData();

  const [appName, setAppName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});

  const handleAction = useCallback(async (
    actionFn: () => Promise<ActionResult>,
    actionName: string,
    successMessage?: string,
    errorMessagePrefix?: string
  ) => {
    setActionStates(prev => ({ ...prev, [actionName]: true }));
    try {
      const result = await actionFn();
      Alert.alert(
        result.success ? 'Success' : 'Error',
        result.message || (result.success ? (successMessage || 'Action completed.') : (errorMessagePrefix || 'Action failed.'))
      );
      if (result.success && actionName === 'openApp') {
        refreshAll();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
    setActionStates(prev => ({ ...prev, [actionName]: false }));
  }, [refreshAll]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshAll();
    setIsRefreshing(false);
  }, [refreshAll]);

  if (isLoadingSystemInfo && !systemInfo && !errorSystemInfo) {
    return <LoadingSpinner text="Fetching system data..." />;
  }

  return (
    <ScrollView
      className="bg-neutral-900 flex-1"
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} progressBackgroundColor="#27272a" />}
    >
      <View className="p-4">
        <Text className="text-3xl font-bold text-sky-300 text-center my-4 pb-2 border-b border-neutral-700">ShellSync Dashboard</Text>

        <View className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionButton
            title="Advanced System Controls"
            onPress={() => router.push('/system-controls')}
            color="primary"
            icon={<Text className="text-xl">⚙️</Text>}
          />
          <ActionButton
            title="View Running Apps"
            onPress={() => router.push('/running-apps')}
            color="primary"
            icon={<Text className="text-xl">📱</Text>}
          />
        </View>

        {errorSystemInfo && (
          <ErrorDisplay
            message={errorSystemInfo.message || 'Could not load system data.'}
            onRetry={refreshAll}
            className="mb-4"
          />
        )}

        <View className="flex-col sm:flex-row gap-4 mb-4">
          <SystemInfoCard cpu={systemInfo.cpu} memory={systemInfo.memory} disk={systemInfo.disk} />
          <NetworkInfoCard network={systemInfo.network} bootTime={systemInfo.boot_time} timestamp={systemInfo.timestamp} />
        </View>
        {!systemInfo && !isLoadingSystemInfo && errorSystemInfo && (
          <Text className="text-neutral-400 text-center p-4 mb-4">Could not load system status. Pull down to retry.</Text>
        )}

        <View className="flex-col sm:flex-row gap-4 mb-4">
          <View className="w-full sm:w-0 sm:flex-1">
            <Section title="Quick Controls">
              <ActionButton
                title="Lock Screen"
                onPress={() => handleAction(lockUserScreen, 'lock', 'Screen locked successfully', 'Failed to lock screen')}
                color="secondary"
                isLoading={actionStates['lock']}
                icon={<Text className="text-xl">🔒</Text>}
                style={{ width: '100%' }}
              />
            </Section>
          </View>
          <View className="w-full sm:w-0 sm:flex-1">
            <Section title="Open Application">
              <TextInput
                className="bg-neutral-800 border border-neutral-700 text-neutral-100 text-base rounded-lg p-3 mb-3 w-full focus:border-sky-500 focus:ring-2 focus:ring-sky-600"
                placeholder="Enter application name"
                placeholderTextColor="#737373"
                value={appName}
                onChangeText={setAppName}
                autoCapitalize="none"
              />
              <ActionButton
                title="Launch App"
                onPress={() => {
                  if (!appName.trim()) {
                    Alert.alert('Input Required', 'Please enter an application name.');
                    return;
                  }
                  handleAction(() => openApp(appName), 'openApp', `Launching ${appName}...`, `Failed to launch ${appName}`);
                  setAppName('');
                }}
                color="primary"
                disabled={!appName.trim()}
                isLoading={actionStates['openApp']}
                icon={<Text className="text-xl">🚀</Text>}
              />
            </Section>
          </View>
        </View>

        <View className="h-10" />
      </View>
    </ScrollView>
  );
}