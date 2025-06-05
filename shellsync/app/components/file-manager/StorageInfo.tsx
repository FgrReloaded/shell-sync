import React from 'react';
import { View, Text } from 'react-native';

export default function StorageInfo() {
  const totalStorage = 512;
  const usedStorage = 287;
  const freeStorage = totalStorage - usedStorage;
  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
          Storage Usage
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>
          {usedStorage}GB of {totalStorage}GB used
        </Text>
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: '#F1F5F9',
          borderRadius: 4,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${usagePercentage}%`,
            backgroundColor: usagePercentage > 80 ? '#EF4444' : usagePercentage > 60 ? '#F59E0B' : '#10B981',
            borderRadius: 4,
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: usagePercentage > 80 ? '#EF4444' : usagePercentage > 60 ? '#F59E0B' : '#10B981',
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>
            Used: {usedStorage}GB
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#F1F5F9',
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>
            Free: {freeStorage}GB
          </Text>
        </View>
      </View>
    </View>
  );
}
