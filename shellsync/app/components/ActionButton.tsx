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
  // Modern button styles matching file manager design
  const getButtonStyle = (): ViewStyle => {
    let buttonStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#1E293B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
    };

    // Size variations
    switch (size) {
      case 'sm':
        buttonStyle.paddingVertical = 10;
        buttonStyle.paddingHorizontal = 16;
        break;
      case 'md':
        buttonStyle.paddingVertical = 16;
        buttonStyle.paddingHorizontal = 24;
        break;
      case 'lg':
        buttonStyle.paddingVertical = 20;
        buttonStyle.paddingHorizontal = 32;
        break;
    }

    // Color and variant combinations with modern colors
    if (variant === 'solid') {
      switch (color) {
        case 'primary':
          buttonStyle.backgroundColor = '#3B82F6';
          buttonStyle.borderColor = '#3B82F6';
          break;
        case 'secondary':
          buttonStyle.backgroundColor = '#64748B';
          buttonStyle.borderColor = '#64748B';
          break;
        case 'danger':
          buttonStyle.backgroundColor = '#EF4444';
          buttonStyle.borderColor = '#EF4444';
          break;
        case 'warning':
          buttonStyle.backgroundColor = '#F59E0B';
          buttonStyle.borderColor = '#F59E0B';
          break;
        case 'success':
          buttonStyle.backgroundColor = '#10B981';
          buttonStyle.borderColor = '#10B981';
          break;
      }
    } else if (variant === 'outline') {
      buttonStyle.backgroundColor = '#FFFFFF';
      buttonStyle.borderWidth = 2;
      switch (color) {
        case 'primary':
          buttonStyle.borderColor = '#3B82F6';
          break;
        case 'secondary':
          buttonStyle.borderColor = '#64748B';
          break;
        case 'danger':
          buttonStyle.borderColor = '#EF4444';
          break;
        case 'warning':
          buttonStyle.borderColor = '#F59E0B';
          break;
        case 'success':
          buttonStyle.borderColor = '#10B981';
          break;
      }
    } else if (variant === 'ghost') {
      buttonStyle.backgroundColor = '#F8FAFC';
      buttonStyle.borderColor = '#E2E8F0';
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

    // Color variations with modern colors
    if (variant === 'solid') {
      textStyle.color = '#FFFFFF';
    } else {
      switch (color) {
        case 'primary':
          textStyle.color = '#3B82F6';
          break;
        case 'secondary':
          textStyle.color = '#64748B';
          break;
        case 'danger':
          textStyle.color = '#EF4444';
          break;
        case 'warning':
          textStyle.color = '#F59E0B';
          break;
        case 'success':
          textStyle.color = '#10B981';
          break;
      }
    }

    if (variant === 'ghost') {
      textStyle.color = '#475569';
    }
    return textStyle;
  }

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
}

export default ActionButton;