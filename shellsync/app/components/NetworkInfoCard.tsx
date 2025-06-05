import React from 'react';
import { View, Text } from 'react-native';
import { NetworkInfo } from '../types/api';

interface NetworkInfoCardProps {
  network: NetworkInfo | null;
  bootTime: string | null;
  timestamp: string | null;
}

const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; unit?: string }> = ({ label, value, unit }) => (
  <View className="flex-row justify-between items-center mb-3">
    <Text className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</Text>
    <Text className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
      {value ?? 'N/A'} {value !== null && value !== undefined && unit}
    </Text>
  </View>
);

// Helper to format bytes
const formatBytes = (bytes: number | undefined | null): string => {
  if (bytes === null || bytes === undefined) return 'N/A';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Invalid Date';
  }
}

const StatusIndicator: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <View className="flex-row items-center mb-4">
    <View
      className="w-3 h-3 rounded-full mr-2"
      style={{ backgroundColor: isOnline ? 'var(--accent-success)' : 'var(--accent-danger)' }}
    />
    <Text className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
      {isOnline ? 'Connected' : 'Offline'}
    </Text>
  </View>
);

const NetworkInfoCard: React.FC<NetworkInfoCardProps> = ({ network, bootTime, timestamp }) => {
  return (
    <View className="flex-1 card-dashboard p-6 mb-4">
      <View className="pb-3 mb-4">
        <Text className="text-2xl font-bold gradient-text-primary">Network & Status</Text>
        <Text className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Connectivity metrics</Text>
      </View>

      <StatusIndicator isOnline={!!network} />

      {network && (
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Text className="text-lg font-bold mr-2" style={{ color: 'var(--text-primary)' }}>📡 Network Traffic</Text>
          </View>
          <InfoItem label="Bytes Sent" value={formatBytes(network.bytes_sent)} />
          <InfoItem label="Bytes Received" value={formatBytes(network.bytes_recv)} />
          <InfoItem label="Packets Sent" value={network.packets_sent?.toLocaleString()} />
          <InfoItem label="Packets Received" value={network.packets_recv?.toLocaleString()} />
        </View>
      )}

      <View>
        <View className="flex-row items-center mb-3">
          <Text className="text-lg font-bold mr-2" style={{ color: 'var(--text-primary)' }}>⏰ System Info</Text>
        </View>
        <InfoItem label="Last Boot Time" value={formatDate(bootTime)} />
        <InfoItem label="Last Update" value={formatDate(timestamp)} />
      </View>
    </View>
  );
};

export default NetworkInfoCard;