import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  className?: string;
  variant?: 'default' | 'pulse' | 'shimmer';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  text,
  className,
  variant = 'default'
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <View
            className="w-16 h-16 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          />
        );
      case 'shimmer':
        return (
          <View
            className="w-16 h-16 rounded-full loading-shimmer"
          />
        );
      default:
        return (
          <View style={{ position: 'relative' }}>
            <View
              className="absolute inset-0 w-16 h-16 rounded-full animate-pulse"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
            />
            <ActivityIndicator
              size={size}
              color="#3b82f6"
              style={{ width: 64, height: 64 }}
            />
          </View>
        );
    }
  };

  return (
    <View
      className={`flex-1 justify-center items-center p-8 ${className || ''}`}
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <View className="card-modern p-8 items-center">
        {renderSpinner()}
        {text && (
          <Text
            className="text-lg font-semibold mt-6 text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            {text}
          </Text>
        )}
        <View className="flex-row mt-4">
          <View
            className="w-2 h-2 rounded-full mr-1 animate-pulse"
            style={{
              backgroundColor: 'var(--accent-primary)',
              animationDelay: '0ms'
            }}
          />
          <View
            className="w-2 h-2 rounded-full mr-1 animate-pulse"
            style={{
              backgroundColor: 'var(--accent-secondary)',
              animationDelay: '200ms'
            }}
          />
          <View
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: 'var(--accent-tertiary)',
              animationDelay: '400ms'
            }}
          />
        </View>
      </View>
    </View>
  );
};


export default LoadingSpinner;