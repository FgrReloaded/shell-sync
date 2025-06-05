import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  color = 'primary',
  disabled = false,
  isLoading = false,
  icon
}) => {
  let baseButtonClass = 'py-3 px-4 rounded-lg shadow-lg flex-row items-center justify-center';
  let baseTextClass = 'font-semibold text-base';

  switch (color) {
    case 'primary':
      baseButtonClass += ' bg-gradient-to-r from-sky-500 to-sky-600 active:from-sky-400 active:to-sky-500';
      baseTextClass += ' text-white';
      break;
    case 'secondary':
      baseButtonClass += ' bg-neutral-700 active:bg-neutral-600';
      baseTextClass += ' text-neutral-200';
      break;
    case 'danger':
      baseButtonClass += ' bg-red-600 active:bg-red-500';
      baseTextClass += ' text-white';
      break;
    case 'warning':
      baseButtonClass += ' bg-amber-500 active:bg-amber-400';
      baseTextClass += ' text-white';
      break;
    case 'success':
      baseButtonClass += ' bg-green-500 active:bg-green-400';
      baseTextClass += ' text-white';
      break;
  }

  if (disabled || isLoading) {
    baseButtonClass += ' opacity-50';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={baseButtonClass}
      style={style}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={color === 'secondary' ? '#e5e5e5' : 'white'} />
      ) : (
        <>
          {icon && <Text className="mr-2">{icon}</Text>}
          <Text className={baseTextClass} style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;