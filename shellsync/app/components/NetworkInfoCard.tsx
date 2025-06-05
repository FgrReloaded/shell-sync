import React from 'react';
import { View, Text } from 'react-native';
import { NetworkInfo } from '../types/api';

interface NetworkInfoCardProps {
  network: NetworkInfo | null;
  bootTime: string | null;
  timestamp: string | null;
}

const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; unit?: string }> = ({ label, value, unit }) => (
  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-sm text-neutral-400">{label}</Text>
    <Text className="text-lg font-semibold text-neutral-100">
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
  } catch (e) {
    return 'Invalid Date';
  }
}

const NetworkInfoCard: React.FC<NetworkInfoCardProps> = ({ network, bootTime, timestamp }) => {
  return (
    <View className="flex-1 bg-neutral-800 p-4 rounded-lg mb-4 shadow-lg border border-neutral-700">
      <View className="pb-2 mb-3 border-b border-neutral-700">
        <Text className="text-xl font-bold text-neutral-100">Connectivity & Status</Text>
      </View>
      {network && (
        <View className="mb-3">
          <Text className="text-lg font-semibold text-neutral-200 mb-1">Network Traffic</Text>
          <InfoItem label="Bytes Sent" value={formatBytes(network.bytes_sent)} />
          <InfoItem label="Bytes Received" value={formatBytes(network.bytes_recv)} />
          <InfoItem label="Packets Sent" value={network.packets_sent?.toLocaleString()} />
          <InfoItem label="Packets Received" value={network.packets_recv?.toLocaleString()} />
        </View>
      )}
      <View>
        <Text className="text-lg font-semibold text-neutral-200 mb-1">System Timestamps</Text>
        <InfoItem label="Last Boot Time" value={formatDate(bootTime)} />
        <InfoItem label="Last Update" value={formatDate(timestamp)} />
      </View>
    </View>
  );
};

export default NetworkInfoCard;