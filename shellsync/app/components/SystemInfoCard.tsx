import React from 'react';
import { View, Text } from 'react-native';
import { CpuInfo, MemoryInfo, DiskInfo } from '../types/api';

interface SystemInfoCardProps {
  cpu: CpuInfo | null;
  memory: MemoryInfo | null;
  disk: DiskInfo | null;
}

const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; unit?: string }> = ({ label, value, unit }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <Text style={{ fontSize: 14, fontWeight: '500', color: '#64748B' }}>{label}</Text>
    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>
      {value ?? 'N/A'} {value !== null && value !== undefined && unit}
    </Text>
  </View>
);

const ProgressBar: React.FC<{ percentage: number | null; color: string }> = ({ percentage, color }) => {
  if (percentage === null || percentage === undefined) return null;

  return (
    <View style={{ marginTop: 8, marginBottom: 12 }}>
      <View style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F1F5F9',
        overflow: 'hidden'
      }}>
        <View
          style={{
            height: '100%',
            borderRadius: 4,
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: percentage > 80 ? '#EF4444' : percentage > 60 ? '#F59E0B' : color
          }}
        />
      </View>
      <Text style={{
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
        color: '#94A3B8',
        fontWeight: '500'
      }}>
        {percentage.toFixed(1)}%
      </Text>
    </View>
  );
};

const SystemInfoCard: React.FC<SystemInfoCardProps> = ({ cpu, memory, disk }) => {
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
          System Overview
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Real-time system metrics</Text>
      </View>

      {cpu && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginRight: 8, color: '#1E293B' }}>🖥️ CPU</Text>
          </View>
          <ProgressBar percentage={cpu.usage_percent} color="#3B82F6" />
          <InfoItem label="Cores" value={cpu.count} />
          {cpu.frequency && <InfoItem label="Frequency" value={cpu.frequency} unit="MHz" />}
        </View>
      )}

      {memory && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginRight: 8, color: '#1E293B' }}>💾 Memory</Text>
          </View>
          <ProgressBar percentage={memory.percent} color="#10B981" />
          <InfoItem label="Used" value={memory.used} unit="GB" />
          <InfoItem label="Available" value={memory.available} unit="GB" />
          <InfoItem label="Total" value={memory.total} unit="GB" />
        </View>
      )}

      {disk && (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginRight: 8, color: '#1E293B' }}>💿 Storage</Text>
          </View>
          <ProgressBar percentage={disk.percent} color="#8B5CF6" />
          <InfoItem label="Used" value={disk.used} unit="GB" />
          <InfoItem label="Free" value={disk.free} unit="GB" />
          <InfoItem label="Total" value={disk.total} unit="GB" />
        </View>
      )}
    </View>
  );
};

export default SystemInfoCard;