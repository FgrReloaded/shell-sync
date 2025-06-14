import React, { useState, useCallback } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import ActionButton from './components/ActionButton';
import * as api from './services/api';
import { ActionResult } from './types/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SystemControlsScreen() {
  const router = useRouter();
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});
  const [screenLockStatus, setScreenLockStatus] = useState<{
    locked?: boolean;
    message?: string;
    checked: boolean;
    error?: string;
  }>({ checked: false });
  const [isLoadingLockStatus, setIsLoadingLockStatus] = useState(false);

  const handleSystemAction = useCallback(
    async (
      actionFn: () => Promise<ActionResult>,
      actionName: string,
      confirmationTitle: string,
      confirmationMessage: string,
      requiresConfirmation: boolean = true
    ) => {
      if (requiresConfirmation) {
        Alert.alert(confirmationTitle, confirmationMessage, [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              setActionStates((prev) => ({ ...prev, [actionName]: true }));
              try {
                const result = await actionFn();
                Alert.alert(
                  result.success ? 'Success' : 'Error',
                  result.message || (result.success ? 'Action initiated.' : 'Action failed.')
                );
              } catch (error: any) {
                Alert.alert('Error', error.message || 'An unexpected error occurred.');
              }
              setActionStates((prev) => ({ ...prev, [actionName]: false }));
            },
            style: 'destructive',
          },
        ]);
      } else {
        setActionStates((prev) => ({ ...prev, [actionName]: true }));
        try {
          const result = await actionFn();
          Alert.alert(
            result.success ? 'Success' : 'Error',
            result.message || (result.success ? 'Action completed.' : 'Action failed.')
          );
        } catch (error: any) {
          Alert.alert('Error', error.message || 'An unexpected error occurred.');
        }
        setActionStates((prev) => ({ ...prev, [actionName]: false }));
      }
    },
    []
  );

  const checkScreenLock = async () => {
    setIsLoadingLockStatus(true);
    setScreenLockStatus({ checked: false }); // Reset previous status
    try {
      const result = await api.getScreenLockStatus();
      if (result.success) {
        setScreenLockStatus({ locked: result.locked, message: result.message, checked: true });
      } else {
        setScreenLockStatus({ message: result.message || 'Failed to get status', checked: true, error: result.message });
        Alert.alert('Error', result.message || 'Could not retrieve screen lock status.');
      }
    } catch (error: any) {
      setScreenLockStatus({ message: error.message || 'An unexpected error occurred', checked: true, error: error.message });
      Alert.alert('Error', error.message || 'An unexpected error occurred while checking lock status.');
    }
    setIsLoadingLockStatus(false);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Stack.Screen
        options={{
          title: 'System Controls',
          headerTintColor: 'var(--text-primary)',
          headerStyle: { backgroundColor: 'var(--bg-secondary)' }
        }}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="p-6"
      >
        {/* Header */}
        <View className="mb-8 animate-fadeInUp">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 self-start"
            style={{ opacity: 0.8 }}
          >
            <Text style={{ color: 'var(--accent-primary)', fontSize: 16 }}>← Back to Dashboard</Text>
          </TouchableOpacity>

          <Text className="text-4xl font-bold gradient-text-primary text-center mb-2">
            System Controls
          </Text>
          <Text className="text-lg text-center" style={{ color: 'var(--text-secondary)' }}>
            Advanced system management tools
          </Text>
        </View>

        {/* Status Check Card */}
        <View className="card-dashboard p-6 mb-8">
          <Text className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            🔍 System Status
          </Text>
          <ActionButton
            title="Check Screen Lock Status"
            onPress={checkScreenLock}
            color="primary"
            isLoading={isLoadingLockStatus}
            icon={<Text className="text-2xl">❓</Text>}
          />
          {screenLockStatus.checked && (
            <View className="mt-4 p-4 rounded-xl" style={{
              backgroundColor: screenLockStatus.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderColor: screenLockStatus.error ? 'var(--accent-danger)' : 'var(--accent-success)',
              borderWidth: 1,
            }}>
              <Text className="text-lg text-center font-semibold" style={{
                color: screenLockStatus.error ? 'var(--accent-danger)' : 'var(--accent-success)'
              }}>
                {screenLockStatus.message}
              </Text>
            </View>
          )}
        </View>

        {/* Control Actions Grid */}
        <View className="card-dashboard p-6">
          <Text className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            ⚡ System Actions
          </Text>
          <View className="gap-4">
            <ActionButton
              title="Lock Screen"
              onPress={() =>
                handleSystemAction(
                  api.lockScreen,
                  'lock',
                  'Lock Screen',
                  'Are you sure you want to lock the screen?',
                  false
                )
              }
              color="secondary"
              isLoading={actionStates['lock']}
              icon={<Text className="text-2xl">🔒</Text>}
            />

            <ActionButton
              title="Unlock Screen"
              onPress={() =>
                handleSystemAction(
                  api.unlockScreen,
                  'unlock',
                  'Unlock Screen',
                  'Are you sure you want to unlock the screen?',
                  false
                )
              }
              color="primary"
              isLoading={actionStates['unlock']}
              icon={<Text className="text-2xl">🔓</Text>}
            />

            <ActionButton
              title="Restart System"
              onPress={() =>
                handleSystemAction(
                  api.restartSystem,
                  'restart',
                  'Confirm Restart',
                  'Are you sure you want to restart the system? This action is irreversible.'
                )
              }
              color="warning"
              isLoading={actionStates['restart']}
              icon={<Text className="text-2xl">🔄</Text>}
            />

            <ActionButton
              title="Shutdown System"
              onPress={() =>
                handleSystemAction(
                  api.shutdownSystem,
                  'shutdown',
                  'Confirm Shutdown',
                  'Are you sure you want to shut down the system? This action is irreversible.'
                )
              }
              color="danger"
              isLoading={actionStates['shutdown']}
              icon={<Text className="text-2xl">🔌</Text>}
            />
          </View>
        </View>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}