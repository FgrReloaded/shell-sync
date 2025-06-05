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
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#3B82F6" colors={['#3B82F6']} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: 24 }}>
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text style={{
            fontSize: 36,
            fontWeight: '800',
            color: '#1E293B',
            textAlign: 'center',
            marginBottom: 8,
            letterSpacing: -1
          }}>
            ShellSync
          </Text>
          <Text style={{
            fontSize: 18,
            color: '#64748B',
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: 24
          }}>
            System Control Dashboard
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E2E8F0'
          }}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              marginRight: 8,
              backgroundColor: systemInfo ? '#10B981' : '#F59E0B'
            }} />
            <Text style={{
              color: '#475569',
              fontSize: 16,
              fontWeight: '500'
            }}>
              {systemInfo ? 'System Connected' : 'Connecting...'}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 32, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flex: 1, minWidth: 160 }}>
            <TouchableOpacity
              onPress={() => router.push('/system-controls')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                shadowColor: '#1E293B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
                height: 210
              }}
              activeOpacity={0.8}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: '#F1F5F9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 24 }}>⚙️</Text>
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1E293B',
                  marginBottom: 8,
                  letterSpacing: -0.3
                }}>
                  System Controls
                </Text>
                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#64748B',
                  lineHeight: 20
                }}>
                  Advanced system management
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, minWidth: 160 }}>
            <TouchableOpacity
              onPress={() => router.push('/running-apps')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                shadowColor: '#1E293B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
                height: 210
              }}
              activeOpacity={0.8}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: '#F1F5F9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 24 }}>📱</Text>
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1E293B',
                  marginBottom: 8,
                  letterSpacing: -0.3
                }}>
                  Running Apps
                </Text>
                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#64748B',
                  lineHeight: 20
                }}>
                  Monitor active processes
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, minWidth: 160 }}>
            <TouchableOpacity
              onPress={() => router.push('/file-manager')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                shadowColor: '#1E293B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
              activeOpacity={0.8}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: '#F1F5F9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 24 }}>📁</Text>
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1E293B',
                  marginBottom: 8,
                  letterSpacing: -0.3
                }}>
                  File Manager
                </Text>
                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#64748B',
                  lineHeight: 20
                }}>
                  Browse and manage files
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {errorSystemInfo && (
          <View style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#FECACA'
          }}>
            <ErrorDisplay
              message={errorSystemInfo.message || 'Could not load system data.'}
              onRetry={refreshAll}
              className="mb-0"
            />
          </View>
        )}

        {systemInfo && (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 300 }}>
              <SystemInfoCard cpu={systemInfo?.cpu || null} memory={systemInfo?.memory || null} disk={systemInfo?.disk || null} />
            </View>
            <View style={{ flex: 1, minWidth: 300 }}>
              <NetworkInfoCard network={systemInfo?.network || null} bootTime={systemInfo?.boot_time || null} timestamp={systemInfo?.timestamp || null} />
            </View>
          </View>
        )}

        {!systemInfo && !isLoadingSystemInfo && errorSystemInfo && (
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            alignItems: 'center'
          }}>
            <Text style={{
              textAlign: 'center',
              color: '#64748B',
              fontSize: 16,
              fontWeight: '500'
            }}>
              Could not load system status. Pull down to retry.
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 300 }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              shadowColor: '#1E293B',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 20,
                color: '#1E293B',
                letterSpacing: -0.3
              }}>
                Quick Actions
              </Text>
              <ActionButton
                title="Lock Screen"
                onPress={() => handleAction(lockUserScreen, 'lock', 'Screen locked successfully', 'Failed to lock screen')}
                color="secondary"
                isLoading={actionStates['lock']}
                icon={<Text style={{ fontSize: 18 }}>🔒</Text>}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          <View style={{ flex: 1, minWidth: 300 }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              shadowColor: '#1E293B',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 20,
                color: '#1E293B',
                letterSpacing: -0.3
              }}>
                Application Launcher
              </Text>
              <TextInput
                style={{
                  marginBottom: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: appName.trim() ? '#3B82F6' : '#E2E8F0',
                  backgroundColor: '#F8FAFC',
                  color: '#1E293B',
                  fontSize: 16,
                  fontWeight: '500',
                }}
                placeholder="Enter application name"
                placeholderTextColor="#94A3B8"
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
                icon={<Text style={{ fontSize: 18 }}>🚀</Text>}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </View>
    </ScrollView>
  );
}