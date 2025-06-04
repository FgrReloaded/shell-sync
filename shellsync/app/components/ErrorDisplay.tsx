import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorDisplayProps {
  message: string | null | undefined;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, className }) => {
  if (!message) return null;

  return (
    <View className={`bg-red-800 border border-red-700 p-4 rounded-lg mx-4 my-2 ${className || ''}`}>
      <Text className="text-red-100 font-semibold mb-2">Oops! Something went wrong.</Text>
      <Text className="text-red-200 text-sm">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-3 bg-red-600 active:bg-red-500 py-2 px-3 rounded-md self-start"
        >
          <Text className="text-white text-sm font-medium">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorDisplay;