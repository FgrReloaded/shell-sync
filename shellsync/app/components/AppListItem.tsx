import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppInfo } from '../types/api';

interface AppListItemProps {
  app: AppInfo;
  onKill: (pid: number) => void;
}

const AppListItem: React.FC<AppListItemProps> = ({ app, onKill }) => {
  const getCpuColor = (cpu: number) => {
    if (cpu > 80) return 'text-danger-400';
    if (cpu > 50) return 'text-warning-400';
    return 'text-success-400';
  };

  const getMemoryColor = (memory: number) => {
    if (memory > 80) return 'text-danger-400';
    if (memory > 50) return 'text-warning-400';
    return 'text-success-400';
  };

  return (
    <View className="bg-white p-5 rounded-2xl mb-4 ">
      <View className="flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <View className="flex-row items-center mb-2">
            <View className="w-3 h-3 bg-success-500 rounded-full mr-3 shadow-success-500/50" />
            <Text className="text-lg font-poppins font-semibold text-blue-500 flex-1" numberOfLines={1}>
              {app.name}
            </Text>
          </View>
          <Text className="text-dark-400 font-poppins text-sm ml-6">
            Process ID: {app.pid}
          </Text>
        </View>

        <View className="mr-4 min-w-[100px]">
          <View className="bg-white rounded-xl p-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-dark-500 font-poppins text-xs">CPU</Text>
              <Text className={`font-poppins font-bold text-sm ${getCpuColor(app.cpu_percent)}`}>
                {app.cpu_percent.toFixed(1)}%
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-dark-500 font-poppins text-xs">RAM</Text>
              <Text className={`font-poppins font-bold text-sm ${getMemoryColor(app.memory_percent)}`}>
                {app.memory_percent.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onKill(app.pid)}
          className="rounded-xl"
          activeOpacity={0.8}
          style={{
            backgroundColor: 'rgb(239, 68, 68)',
          }}
        >
          <Text className="text-white p-4 font-poppins text-sm" style={{ borderRadius: 8, fontWeight: '800' }}>
            Kill
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4 space-y-2">
        <View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-dark-400 font-poppins text-xs">CPU Usage</Text>
            <Text className={`font-poppins font-medium text-xs ${getCpuColor(app.cpu_percent)}`}>
              {app.cpu_percent.toFixed(1)}%
            </Text>
          </View>
          <View className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full ${app.cpu_percent > 80 ? 'bg-gradient-to-r from-danger-500 to-danger-600' :
                app.cpu_percent > 50 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                  'bg-gradient-to-r from-success-500 to-success-600'
                }`}
              style={{ width: `${Math.min(app.cpu_percent, 100)}%` }}
            />
          </View>
        </View>

        <View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-dark-400 font-poppins text-xs">Memory Usage</Text>
            <Text className={`font-poppins font-medium text-xs ${getMemoryColor(app.memory_percent)}`}>
              {app.memory_percent.toFixed(1)}%
            </Text>
          </View>
          <View className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full ${app.memory_percent > 80 ? 'bg-gradient-to-r from-danger-500 to-danger-600' :
                app.memory_percent > 50 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                  'bg-gradient-to-r from-success-500 to-success-600'
                }`}
              style={{ width: `${Math.min(app.memory_percent, 100)}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AppListItem;