import React from 'react';
import { View, Text } from 'react-native';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  containerClassName?: string;
  titleClassName?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  containerClassName,
  titleClassName,
  icon,
  subtitle
}) => {
  return (
    <View className={`mb-8 ${containerClassName || ''}`}>
      <View className="flex-row items-center mb-6">
        {icon && (
          <View className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4 shadow-primary-500/30">
            {icon}
          </View>
        )}
        <View className="flex-1">
          <Text className={`text-2xl font-poppins font-bold text-dark-50 ${titleClassName || ''}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-dark-400 font-poppins text-sm mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View className="border-l-4 border-gradient-to-b from-primary-500 to-secondary-500 pl-4">
        {children}
      </View>
    </View>
  );
};

export default Section;