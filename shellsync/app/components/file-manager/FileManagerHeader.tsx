import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface FileManagerHeaderProps {
  title: string;
  onBack: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function FileManagerHeader({ title, onBack, viewMode, onViewModeChange }: FileManagerHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>

        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#1E293B',
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#64748B',
              marginTop: 2,
            }}
          >
            Browse and manage your files
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => onViewModeChange('grid')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: viewMode === 'grid' ? '#3B82F6' : '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, color: viewMode === 'grid' ? '#FFFFFF' : '#64748B' }}>⚏</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onViewModeChange('list')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: viewMode === 'list' ? '#3B82F6' : '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, color: viewMode === 'list' ? '#FFFFFF' : '#64748B' }}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
