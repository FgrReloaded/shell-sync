import React from 'react';
import { View, Text } from 'react-native';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  containerClassName?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, containerClassName }) => {
  return (
    <View className={`mb-6 ${containerClassName || ''}`}>
      <Text className="text-2xl font-bold text-neutral-200 mb-3 px-4">{title}</Text>
      {children}
    </View>
  );
};

export default Section;