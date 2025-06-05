import React from 'react';
import { View, Text } from 'react-native';
import { CpuInfo, MemoryInfo, DiskInfo } from '../types/api';

interface SystemInfoCardProps {
  cpu: CpuInfo | null;
  memory: MemoryInfo | null;
  disk: DiskInfo | null;
}

const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; unit?: string }> = ({ label, value, unit }) => (
  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-sm text-neutral-400">{label}</Text>
    <Text className="text-lg font-semibold text-neutral-100">
      {value ?? 'N/A'} {value !== null && value !== undefined && unit}
    </Text>
  </View>
);

const SystemInfoCard: React.FC<SystemInfoCardProps> = ({ cpu, memory, disk }) => {
  return (
    <View className="flex-1 bg-neutral-800 p-4 rounded-lg mb-4 shadow-lg border border-neutral-700">
      <View className="pb-2 mb-3 border-b border-neutral-700">
        <Text className="text-xl font-bold text-neutral-100">System Overview</Text>
      </View>

      {cpu && (
        <View className="mb-3">
          <Text className="text-lg font-semibold text-neutral-200 mb-1">CPU</Text>
          <InfoItem label="Usage" value={cpu.usage_percent} unit="%" />
          <InfoItem label="Cores" value={cpu.count} />
          {cpu.frequency && <InfoItem label="Frequency" value={cpu.frequency} unit="MHz" />}
        </View>
      )}

      {memory && (
        <View className="mb-3">
          <Text className="text-lg font-semibold text-neutral-200 mb-1">Memory</Text>
          <InfoItem label="Usage" value={memory.percent} unit="%" />
          <InfoItem label="Used" value={memory.used} unit="GB" />
          <InfoItem label="Available" value={memory.available} unit="GB" />
          <InfoItem label="Total" value={memory.total} unit="GB" />
        </View>
      )}

      {disk && (
        <View>
          <Text className="text-lg font-semibold text-neutral-200 mb-1">Disk</Text>
          <InfoItem label="Usage" value={disk.percent} unit="%" />
          <InfoItem label="Used" value={disk.used} unit="GB" />
          <InfoItem label="Free" value={disk.free} unit="GB" />
          <InfoItem label="Total" value={disk.total} unit="GB" />
        </View>
      )}
    </View>
  );
};

export default SystemInfoCard;