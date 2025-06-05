import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  color = 'primary',
  disabled = false,
  isLoading = false,
  icon,
  size = 'md',
  variant = 'solid'
}) => {
  // Base button styles using CSS variables
  const getButtonStyle = (): ViewStyle => {
    let buttonStyle: ViewStyle = {
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    };

    // Size variations
    switch (size) {
      case 'sm':
        buttonStyle.paddingVertical = 8;
        buttonStyle.paddingHorizontal = 12;
        break;
      case 'md':
        buttonStyle.paddingVertical = 14;
        buttonStyle.paddingHorizontal = 24;
        break;
      case 'lg':
        buttonStyle.paddingVertical = 18;
        buttonStyle.paddingHorizontal = 32;
        break;
    }

    // Color and variant combinations
    if (variant === 'solid') {
      switch (color) {
        case 'primary':
          buttonStyle.backgroundColor = '#3b82f6';
          buttonStyle.shadowColor = '#3b82f6';
          break;
        case 'secondary':
          buttonStyle.backgroundColor = '#8b5cf6';
          buttonStyle.shadowColor = '#8b5cf6';
          break;
        case 'danger':
          buttonStyle.backgroundColor = '#ef4444';
          buttonStyle.shadowColor = '#ef4444';
          break;
        case 'warning':
          buttonStyle.backgroundColor = '#f59e0b';
          buttonStyle.shadowColor = '#f59e0b';
          break;
        case 'success':
          buttonStyle.backgroundColor = '#10b981';
          buttonStyle.shadowColor = '#10b981';
          break;
      }
    } else if (variant === 'outline') {
      buttonStyle.backgroundColor = 'transparent';
      buttonStyle.borderWidth = 2;
      switch (color) {
        case 'primary':
          buttonStyle.borderColor = '#3b82f6';
          break;
        case 'secondary':
          buttonStyle.borderColor = '#8b5cf6';
          break;
        case 'danger':
          buttonStyle.borderColor = '#ef4444';
          break;
        case 'warning':
          buttonStyle.borderColor = '#f59e0b';
          break;
        case 'success':
          buttonStyle.borderColor = '#10b981';
          break;
      }
    }

    if (disabled || isLoading) {
      buttonStyle.opacity = 0.5;
    }

    return buttonStyle;
  };

  const getTextStyle = (): TextStyle => {
    let textStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size variations
    switch (size) {
      case 'sm':
        textStyle.fontSize = 14;
        break;
      case 'md':
        textStyle.fontSize = 16;
        break;
      case 'lg':
        textStyle.fontSize = 18;
        break;
    }

    // Color variations
    if (variant === 'solid') {
      textStyle.color = '#ffffff';
    } else {
      switch (color) {
        case 'primary':
          textStyle.color = '#60a5fa';
          break;
        case 'secondary':
          textStyle.color = '#c084fc';
          break;
        case 'danger':
          textStyle.color = '#f87171';
          break;
        case 'warning':
          textStyle.color = '#fbbf24';
          break;
        case 'success':
          textStyle.color = '#34d399';
          break;
      }
    }

    return textStyle;
  };

  const getLoadingColor = () => {
    if (variant === 'solid') return 'white';
    switch (color) {
      case 'primary': return '#60a5fa';
      case 'secondary': return '#c084fc';
      case 'danger': return '#f87171';
      case 'warning': return '#fbbf24';
      case 'success': return '#34d399';
      default: return '#60a5fa';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={getLoadingColor()} />
          <Text style={[getTextStyle(), { marginLeft: 8 }, textStyle]}>
            Loading...
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && (
            <View style={{ marginRight: 8 }}>
              {icon}
            </View>
          )}
          <Text style={[getTextStyle(), textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;