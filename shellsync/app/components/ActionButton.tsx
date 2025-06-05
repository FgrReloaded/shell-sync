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
      baseButtonClass += ' bg-sky-500 active:bg-sky-600';
      baseTextClass += ' text-white';
      break;
    case 'secondary':
      baseButtonClass += ' border border-neutral-500 bg-transparent active:bg-neutral-700';
      baseTextClass += ' text-neutral-100 active:text-white';
      break;
    case 'danger':
      baseButtonClass += ' bg-red-600 active:bg-red-700';
      baseTextClass += ' text-white';
      break;
    case 'warning':
      baseButtonClass += ' bg-amber-500 active:bg-amber-600';
      baseTextClass += ' text-white';
      break;
    case 'success':
      baseButtonClass += ' bg-green-500 active:bg-green-600';
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
        <ActivityIndicator size="small" color={color === 'primary' || color === 'danger' || color === 'warning' || color === 'success' ? 'white' : '#ccc'} />
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