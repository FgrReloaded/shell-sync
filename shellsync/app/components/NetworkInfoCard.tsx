import React from 'react';
import { View, Text } from 'react-native';
import { NetworkInfo } from '../types/api';

interface NetworkInfoCardProps {
  network: NetworkInfo | null;
  bootTime: string | null;
  timestamp: string | null;
}

const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; unit?: string }> = ({ label, value, unit }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <Text style={{ fontSize: 14, fontWeight: '500', color: '#64748B' }}>{label}</Text>
    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>
      {value ?? 'N/A'} {value !== null && value !== undefined && unit}
    </Text>
  </View>
);

const formatBytes = (bytes: number | undefined | null): string => {
  if (bytes === null || bytes === undefined) return 'N/A';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Invalid Date';
  }
}

const StatusIndicator: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
        backgroundColor: isOnline ? '#10B981' : '#EF4444'
      }}
    />
    <Text style={{ fontSize: 14, fontWeight: '500', color: '#64748B' }}>
      {isOnline ? 'Connected' : 'Offline'}
    </Text>
  </View>
);

const NetworkInfoCard: React.FC<NetworkInfoCardProps> = ({ network, bootTime, timestamp }) => {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      shadowColor: '#1E293B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View style={{ paddingBottom: 12, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '800',
          color: '#1E293B',
          letterSpacing: -0.5,
          marginBottom: 4
        }}>
          Network & Status
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Connectivity metrics</Text>
      </View>

      <StatusIndicator isOnline={!!network} />

      {network && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginRight: 8, color: '#1E293B' }}>📡 Network Traffic</Text>
          </View>
          <InfoItem label="Bytes Sent" value={formatBytes(network.bytes_sent)} />
          <InfoItem label="Bytes Received" value={formatBytes(network.bytes_recv)} />
          <InfoItem label="Packets Sent" value={network.packets_sent?.toLocaleString()} />
          <InfoItem label="Packets Received" value={network.packets_recv?.toLocaleString()} />
        </View>
      )}

      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginRight: 8, color: '#1E293B' }}>⏰ System Info</Text>
        </View>
        <InfoItem label="Last Boot Time" value={formatDate(bootTime)} />
        <InfoItem label="Last Update" value={formatDate(timestamp)} />
      </View>
    </View>
  );
};

export default NetworkInfoCard;