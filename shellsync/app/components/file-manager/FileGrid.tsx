import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string | null;
  modified: string;
  icon: string;
}

interface FileGridProps {
  files: FileItem[];
  onFilePress: (file: FileItem) => void;
}

export default function FileGrid({ files, onFilePress }: FileGridProps) {
  const folders = files.filter(file => file.type === 'folder');
  const regularFiles = files.filter(file => file.type === 'file');

  const renderFileItem = (file: FileItem) => (
    <TouchableOpacity
      key={file.id}
      onPress={() => onFilePress(file)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        alignItems: 'center',
        minHeight: 120,
        justifyContent: 'space-between',
      }}
      activeOpacity={0.7}
    >
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 32, marginBottom: 8 }}>{file.icon}</Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#1E293B',
            textAlign: 'center',
            lineHeight: 18,
          }}
          numberOfLines={2}
        >
          {file.name}
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 8 }}>
        {file.size && (
          <Text
            style={{
              fontSize: 12,
              color: '#64748B',
              fontWeight: '500',
              marginBottom: 2,
            }}
          >
            {file.size}
          </Text>
        )}
        <Text
          style={{
            fontSize: 11,
            color: '#94A3B8',
            fontWeight: '500',
          }}
        >
          {file.modified}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {folders.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1E293B',
              marginBottom: 16,
            }}
          >
            Folders ({folders.length})
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {folders.map(file => (
              <View key={file.id} style={{ width: '48%' }}>
                {renderFileItem(file)}
              </View>
            ))}
          </View>
        </View>
      )}

      {regularFiles.length > 0 && (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1E293B',
              marginBottom: 16,
            }}
          >
            Files ({regularFiles.length})
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {regularFiles.map(file => (
              <View key={file.id} style={{ width: '48%' }}>
                {renderFileItem(file)}
              </View>
            ))}
          </View>
        </View>
      )}

      {files.length === 0 && (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 40,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F1F5F9',
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📂</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1E293B',
              marginBottom: 8,
            }}
          >
            No files found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#64748B',
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            This folder is empty or no files match your search criteria.
          </Text>
        </View>
      )}
    </View>
  );
}
