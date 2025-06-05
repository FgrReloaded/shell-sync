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
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#3B82F6',
              opacity: 0.6
            }}
          />
        );
      case 'shimmer':
        return (
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#F1F5F9'
            }}
          />
        );
      default:
        return (
          <View style={{ position: 'relative' }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
              }}
            />
            <ActivityIndicator
              size={size}
              color="#3B82F6"
              style={{ width: 64, height: 64 }}
            />
          </View>
        );
    }
  };

  return (
    <View
      className={`flex-1 justify-center items-center p-8 ${className || ''}`}
      style={{
        backgroundColor: 'rgb(255, 255, 255)',
      }}
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