import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import FileManagerHeader from './components/file-manager/FileManagerHeader';
import SearchBar from './components/file-manager/SearchBar';
import BreadcrumbNavigation from './components/file-manager/BreadcrumbNavigation';
import FileGrid from './components/file-manager/FileGrid';
import FileList from './components/file-manager/FileList';
import StorageInfo from './components/file-manager/StorageInfo';

export default function FileManagerScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for demonstration
  const files = [
    { id: '1', name: 'Documents', type: 'folder', size: null, modified: '2024-01-15', icon: '📁' },
    { id: '2', name: 'Downloads', type: 'folder', size: null, modified: '2024-01-14', icon: '📁' },
    { id: '3', name: 'Pictures', type: 'folder', size: null, modified: '2024-01-13', icon: '📁' },
    { id: '4', name: 'Music', type: 'folder', size: null, modified: '2024-01-12', icon: '📁' },
    { id: '5', name: 'Videos', type: 'folder', size: null, modified: '2024-01-11', icon: '📁' },
    { id: '6', name: 'report.pdf', type: 'file', size: '2.4 MB', modified: '2024-01-10', icon: '📄' },
    { id: '7', name: 'presentation.pptx', type: 'file', size: '15.2 MB', modified: '2024-01-09', icon: '📊' },
    { id: '8', name: 'image.jpg', type: 'file', size: '3.1 MB', modified: '2024-01-08', icon: '🖼️' },
    { id: '9', name: 'backup.zip', type: 'file', size: '45.8 MB', modified: '2024-01-07', icon: '🗜️' },
    { id: '10', name: 'notes.txt', type: 'file', size: '1.2 KB', modified: '2024-01-06', icon: '📝' },
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilePress = (file: typeof files[0]) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
    }
  };

  const handleBreadcrumbPress = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <FileManagerHeader
        title="File Manager"
        onBack={() => router.back()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search files and folders..."
          />

          <BreadcrumbNavigation
            path={currentPath}
            onBreadcrumbPress={handleBreadcrumbPress}
          />

          <StorageInfo />

          {viewMode === 'grid' ? (
            <FileGrid
              files={filteredFiles}
              onFilePress={handleFilePress}
            />
          ) : (
            <FileList
              files={filteredFiles}
              onFilePress={handleFilePress}
            />
          )}

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}
