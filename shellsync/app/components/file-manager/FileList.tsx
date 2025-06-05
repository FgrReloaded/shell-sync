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

interface FileListProps {
  files: FileItem[];
  onFilePress: (file: FileItem) => void;
}

export default function FileList({ files, onFilePress }: FileListProps) {
  const folders = files.filter(file => file.type === 'folder');
  const regularFiles = files.filter(file => file.type === 'file');

  const renderFileItem = (file: FileItem, isLast: boolean = false) => (
    <TouchableOpacity
      key={file.id}
      onPress={() => onFilePress(file)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: isLast ? 0 : 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: file.type === 'folder' ? '#EEF2FF' : '#F8FAFC',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        <Text style={{ fontSize: 20 }}>{file.icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1E293B',
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {file.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 13,
              color: '#64748B',
              fontWeight: '500',
            }}
          >
            {file.modified}
          </Text>
          {file.size && (
            <>
              <Text
                style={{
                  fontSize: 12,
                  color: '#CBD5E1',
                  marginHorizontal: 8,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#64748B',
                  fontWeight: '500',
                }}
              >
                {file.size}
              </Text>
            </>
          )}
        </View>
      </View>

      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: '#F8FAFC',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 16, color: '#64748B' }}>→</Text>
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
          <View>
            {folders.map((file, index) => renderFileItem(file, index === folders.length - 1))}
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
          <View>
            {regularFiles.map((file, index) => renderFileItem(file, index === regularFiles.length - 1))}
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
