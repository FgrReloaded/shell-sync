import React from 'react';
import { View, Text } from 'react-native';
import { CpuInfo, MemoryInfo, DiskInfo } from '../types/api';

interface SystemInfoCardProps {
  cpu: CpuInfo | null;
  memory: MemoryInfo | null;
  disk: DiskInfo | null;
}

const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; unit?: string }> = ({ label, value, unit }) => (
  <View className="flex-row justify-between items-center mb-3">
    <Text className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</Text>
    <Text className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
      {value ?? 'N/A'} {value !== null && value !== undefined && unit}
    </Text>
  </View>
);

const ProgressBar: React.FC<{ percentage: number | null; color: string }> = ({ percentage, color }) => {
  if (percentage === null || percentage === undefined) return null;

  return (
    <View className="mt-2 mb-3">
      <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <View
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: percentage > 80 ? 'var(--accent-danger)' : percentage > 60 ? 'var(--accent-warning)' : color
          }}
        />
      </View>
      <Text className="text-xs text-right mt-1" style={{ color: 'var(--text-muted)' }}>
        {percentage.toFixed(1)}%
      </Text>
    </View>
  );
};

const SystemInfoCard: React.FC<SystemInfoCardProps> = ({ cpu, memory, disk }) => {
  return (
    <View className="flex-1 card-dashboard p-6 mb-4">
      <View className="pb-3 mb-4">
        <Text className="text-2xl font-bold gradient-text-primary">System Overview</Text>
        <Text className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Real-time system metrics</Text>
      </View>

      {cpu && (
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-lg font-bold mr-2" style={{ color: 'var(--text-primary)' }}>🖥️ CPU</Text>
          </View>
          <ProgressBar percentage={cpu.usage_percent} color="var(--accent-primary)" />
          <InfoItem label="Cores" value={cpu.count} />
          {cpu.frequency && <InfoItem label="Frequency" value={cpu.frequency} unit="MHz" />}
        </View>
      )}

      {memory && (
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-lg font-bold mr-2" style={{ color: 'var(--text-primary)' }}>💾 Memory</Text>
          </View>
          <ProgressBar percentage={memory.percent} color="var(--accent-secondary)" />
          <InfoItem label="Used" value={memory.used} unit="GB" />
          <InfoItem label="Available" value={memory.available} unit="GB" />
          <InfoItem label="Total" value={memory.total} unit="GB" />
        </View>
      )}

      {disk && (
        <View>
          <View className="flex-row items-center mb-2">
            <Text className="text-lg font-bold mr-2" style={{ color: 'var(--text-primary)' }}>💿 Storage</Text>
          </View>
          <ProgressBar percentage={disk.percent} color="var(--accent-tertiary)" />
          <InfoItem label="Used" value={disk.used} unit="GB" />
          <InfoItem label="Free" value={disk.free} unit="GB" />
          <InfoItem label="Total" value={disk.total} unit="GB" />
        </View>
      )}
    </View>
  );
};

export default SystemInfoCard;