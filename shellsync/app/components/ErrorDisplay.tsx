import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorDisplayProps {
  message: string | null | undefined;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onRetry,
  className,
  variant = 'default'
}) => {
  if (!message) return null;

  return (
    <View
      className={`p-6 rounded-2xl my-3 ${className || ''}`}
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'var(--accent-danger)',
        borderWidth: 1,
        shadowColor: 'var(--accent-danger)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="flex-row items-start">
        <View
          className="w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5"
          style={{ backgroundColor: 'var(--accent-danger)' }}
        >
          <Text className="text-white font-bold text-sm">!</Text>
        </View>
        <View className="flex-1">
          <Text
            className="font-bold text-lg mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {variant === 'minimal' ? 'Error' : 'Something went wrong'}
          </Text>
          <Text
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {message}
          </Text>
          {variant === 'detailed' && (
            <Text
              className="text-sm mt-2 opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              Please check your connection and try again. If the problem persists, contact support.
            </Text>
          )}
        </View>
      </View>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-6 py-3 px-6 rounded-xl self-start"
          style={{
            backgroundColor: 'var(--accent-danger)',
            shadowColor: 'var(--accent-danger)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorDisplay;