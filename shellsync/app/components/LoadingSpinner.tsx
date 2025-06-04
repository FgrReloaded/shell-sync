import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'large', text, className }) => {
  return (
    <View className={`flex-1 justify-center items-center p-5 ${className || ''}`}>
      <ActivityIndicator size={size} color="#38bdf8" />
      {text && <Text className="mt-2 text-neutral-400 text-sm">{text}</Text>}
    </View>
  );
};

export default LoadingSpinner;