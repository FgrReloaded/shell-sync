import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppInfo } from '../types/api';

interface AppListItemProps {
  app: AppInfo;
  onKill: (pid: number) => void;
}

const AppListItem: React.FC<AppListItemProps> = ({ app, onKill }) => {
  return (
    <View className="bg-neutral-800 p-3 rounded-lg mb-3 flex-row justify-between items-center shadow-lg border border-neutral-700">
      <View className="flex-1 mr-2">
        <Text className="text-base font-semibold text-neutral-100 truncate" numberOfLines={1}>{app.name}</Text>
        <Text className="text-xs text-neutral-400">PID: {app.pid}</Text>
      </View>
      <View className="w-24 mr-2">
        <Text className="text-xs text-neutral-300 text-right">CPU: {app.cpu_percent.toFixed(1)}%</Text>
        <Text className="text-xs text-neutral-300 text-right">Mem: {app.memory_percent.toFixed(1)}%</Text>
      </View>
      <TouchableOpacity
        onPress={() => onKill(app.pid)}
        className="bg-red-600 hover:bg-red-700 active:bg-red-800 py-2 px-3 rounded-md shadow-lg"
      >
        <Text className="text-white text-xs font-medium">Kill</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppListItem;