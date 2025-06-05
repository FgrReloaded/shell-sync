import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface BreadcrumbNavigationProps {
  path: string[];
  onBreadcrumbPress: (index: number) => void;
}

export default function BreadcrumbNavigation({ path, onBreadcrumbPress }: BreadcrumbNavigationProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: 'row' }}
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}
      >
        {path.map((segment, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => onBreadcrumbPress(index)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: index === path.length - 1 ? '#EEF2FF' : 'transparent',
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: index === path.length - 1 ? '600' : '500',
                  color: index === path.length - 1 ? '#3B82F6' : '#64748B',
                }}
              >
                {segment}
              </Text>
            </TouchableOpacity>

            {index < path.length - 1 && (
              <Text
                style={{
                  fontSize: 14,
                  color: '#CBD5E1',
                  marginHorizontal: 4,
                }}
              >
                /
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
