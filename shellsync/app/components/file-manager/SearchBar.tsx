import React from 'react';
import { View, TextInput, Text } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 2,
          borderColor: value ? '#3B82F6' : '#E2E8F0',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 16,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Text style={{ fontSize: 18, color: '#94A3B8' }}>🔍</Text>
        </View>

        <TextInput
          style={{
            paddingLeft: 52,
            paddingRight: 16,
            paddingVertical: 16,
            fontSize: 16,
            color: '#1E293B',
            fontWeight: '500',
          }}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {value && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>
            Found results for "{value}"
          </Text>
        </View>
      )}
    </View>
  );
}
