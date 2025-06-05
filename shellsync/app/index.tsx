import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSystemData } from './hooks/useSystemData';
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
      className="flex-1"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#3b82f6" colors={['#3b82f6']} progressBackgroundColor="#0a0e1a" />}
    >
      <View className="p-6">
        {/* Modern Header */}
        <View className="mb-8 animate-fadeInUp">
          <Text className="text-4xl font-bold gradient-text-primary text-center mb-2">ShellSync</Text>
          <Text className="text-lg text-center mb-6" style={{ color: 'var(--text-secondary)' }}>System Control Dashboard</Text>

          {/* Status Indicator */}
          <View className="flex-row justify-center items-center mb-6">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: systemInfo ? 'var(--accent-success)' : 'var(--accent-warning)' }} />
            <Text style={{ color: 'var(--text-muted)' }}>
              {systemInfo ? 'System Connected' : 'Connecting...'}
            </Text>
          </View>
        </View>

        {/* Navigation Cards */}
        <View className="mb-8 flex-row gap-4">
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => router.push('/system-controls')}
              className="card-dashboard p-6 flex-1"
              activeOpacity={0.8}
            >
              <View className="items-center">
                <Text className="text-3xl mb-3">⚙️</Text>
                <Text className="text-lg font-semibold text-center" style={{ color: 'var(--text-primary)' }}>System Controls</Text>
                <Text className="text-sm text-center mt-1" style={{ color: 'var(--text-muted)' }}>Advanced system management</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => router.push('/running-apps')}
              className="card-dashboard p-6 flex-1"
              activeOpacity={0.8}
            >
              <View className="items-center">
                <Text className="text-3xl mb-3">📱</Text>
                <Text className="text-lg font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Running Apps</Text>
                <Text className="text-sm text-center mt-1" style={{ color: 'var(--text-muted)' }}>Monitor active processes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {errorSystemInfo && (
          <View className="card-modern p-4 mb-6" style={{ backgroundColor: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}>
            <ErrorDisplay
              message={errorSystemInfo.message || 'Could not load system data.'}
              onRetry={refreshAll}
              className="mb-0"
            />
          </View>
        )}

        {systemInfo && (
          <View className="flex-col sm:flex-row gap-4 mb-8">
            <SystemInfoCard cpu={systemInfo?.cpu || null} memory={systemInfo?.memory || null} disk={systemInfo?.disk || null} />
            <NetworkInfoCard network={systemInfo?.network || null} bootTime={systemInfo?.boot_time || null} timestamp={systemInfo?.timestamp || null} />
          </View>
        )}

        {!systemInfo && !isLoadingSystemInfo && errorSystemInfo && (
          <View className="card-modern p-6 mb-6">
            <Text className="text-center" style={{ color: 'var(--text-muted)' }}>
              Could not load system status. Pull down to retry.
            </Text>
          </View>
        )}

        {/* Action Controls Grid */}
        <View className="flex-col sm:flex-row gap-6 mb-8">
          <View className="flex-1">
            <View className="card-dashboard p-6">
              <Text className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
              </Text>
              <ActionButton
                title="Lock Screen"
                onPress={() => handleAction(lockUserScreen, 'lock', 'Screen locked successfully', 'Failed to lock screen')}
                color="secondary"
                isLoading={actionStates['lock']}
                icon={<Text className="text-xl">🔒</Text>}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          <View className="flex-1">
            <View className="card-dashboard p-6">
              <Text className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Application Launcher
              </Text>
              <TextInput
                className="mb-4 p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  fontSize: 16,
                }}
                placeholder="Enter application name"
                placeholderTextColor="var(--text-muted)"
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
            </View>
          </View>
        </View>

        <View className="h-16" />
      </View>
    </ScrollView>
  );
}