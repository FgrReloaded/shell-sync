import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSystemData } from './hooks/useSystemData';
import Section from './components/Section';
import SystemInfoCard from './components/SystemInfoCard';
import NetworkInfoCard from './components/NetworkInfoCard';
import AppListItem from './components/AppListItem';
import ActionButton from './components/ActionButton';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { AppInfo, ActionResult } from './types/api';

export default function DashboardScreen() {
  const router = useRouter();
  const {
    systemInfo,
    apps,
    isLoadingSystemInfo,
    isLoadingApps,
    errorSystemInfo,
    errorApps,
    refreshAll,
    killApp,
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
    errorMessagePrefix?: string,
    requiresConfirmation: boolean = false
  ) => {
    setActionStates(prev => ({ ...prev, [actionName]: true }));
    try {
      if (requiresConfirmation) {
        // Simplified: confirmation for actions on this screen can be direct if ever needed
        // For now, only lock screen uses this on index.tsx, which doesn't need confirmation here
      }
      const result = await actionFn();
      Alert.alert(
        result.success ? 'Success' : 'Error',
        result.message || (result.success ? (successMessage || 'Action completed.') : (errorMessagePrefix || 'Action failed.'))
      );
      if (result.success && (actionName === 'openApp' || actionName === 'killApp')) {
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

  if (isLoadingSystemInfo && isLoadingApps && !systemInfo && apps.length === 0) {
    return <LoadingSpinner text="Fetching system data..." />;
  }

  const renderAppItem = ({ item }: { item: AppInfo }) => (
    <AppListItem app={item} onKill={(pid: number) => handleAction(() => killApp(pid), 'killApp', `Process ${pid} terminated.`, `Failed to kill ${pid}`)} />
  );

  return (
    <ScrollView
      className="bg-neutral-900 flex-1 pt-5"
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />}
    >
      <Text className="text-4xl font-bold text-sky-400 text-center my-6">ShellSync</Text>

      <View className="px-4 mb-6">
        <ActionButton
          title="Advanced System Controls"
          onPress={() => router.push('/system-controls' as any)}
          color="primary"
          icon={<Text className="text-xl">⚙️</Text>}
        />
      </View>

      {(errorSystemInfo || errorApps) && (
        <ErrorDisplay
          message={errorSystemInfo?.message || errorApps?.message || 'Could not load some data.'}
          onRetry={refreshAll}
        />
      )}

      <Section title="System Status">
        {isLoadingSystemInfo && !systemInfo && <LoadingSpinner size="small" text="Loading system info..." className="h-40" />}
        {systemInfo && (
          <>
            <SystemInfoCard cpu={systemInfo.cpu} memory={systemInfo.memory} disk={systemInfo.disk} />
            <NetworkInfoCard network={systemInfo.network} bootTime={systemInfo.boot_time} timestamp={systemInfo.timestamp} />
          </>
        )}
      </Section>

      <Section title="System Controls">
        <View className="px-4">
          <View className="flex-row justify-between mb-3">
            <ActionButton title="Lock Screen" onPress={() => handleAction(lockUserScreen, 'lock', 'Screen locked successfully', 'Failed to lock screen', false)} color="secondary" style={{ flex: 1, marginRight: 8 }} isLoading={actionStates['lock']} />
          </View>
        </View>
      </Section>

      <Section title="Open Application">
        <View className="px-4 mb-4">
          <TextInput
            className="bg-neutral-800 border border-neutral-700 text-neutral-100 text-base rounded-lg p-3 mb-3 w-full focus:border-sky-500"
            placeholder="Enter application name (e.g., code, firefox)"
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
          />
        </View>
      </Section>

      <Section title="Running Processes">
        {isLoadingApps && apps.length === 0 && <LoadingSpinner size="small" text="Loading applications..." className="h-40" />}
        {apps.length > 0 ? (
          <FlatList
            data={apps}
            renderItem={renderAppItem}
            keyExtractor={(item) => item.pid.toString()}
            scrollEnabled={false} // ScrollView is the parent
          />
        ) : (
          !isLoadingApps && <Text className="text-neutral-400 text-center px-4">No applications to display or unable to fetch.</Text>
        )}
      </Section>

      <View className="h-10" />
    </ScrollView>
  );
}