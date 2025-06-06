import { useState, useEffect } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FileManagerHeader from './components/file-manager/FileManagerHeader';
import BreadcrumbNavigation from './components/file-manager/BreadcrumbNavigation';
import FileGrid from './components/file-manager/FileGrid';
import FileList from './components/file-manager/FileList';
import StorageInfo from './components/file-manager/StorageInfo';
import Terminal from './components/file-manager/Terminal';
import { fileService, FileItem } from './services/fileService';

export default function FileManagerScreen() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [currentDirectory, setCurrentDirectory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);

  const loadDirectory = async (path: string = '') => {
    setLoading(true);
    try {
      const response = await fileService.listDirectory(path);
      if (response.success && response.files) {
        setFiles(response.files);
        setCurrentDirectory(response.path || '');

        if (response.path) {
          const pathParts = response.path.split('/').filter(part => part !== '');
          setCurrentPath(['Home', ...pathParts]);
        } else {
          setCurrentPath(['Home']);
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to load directory');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };


  const handleFilePress = async (file: FileItem) => {
    if (file.type === 'folder') {
      await loadDirectory(file.path);
    } else {
      Alert.alert(
        'File Selected',
        `Would you like to read the content of ${file.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Read', onPress: () => readFileContent(file.path) }
        ]
      );
    }
  };

  const readFileContent = async (filePath: string) => {
    try {
      const response = await fileService.readFile(filePath);
      if (response.success && response.content) {
        Alert.alert('File Content', response.content.substring(0, 500) + '...');
      } else {
        Alert.alert('Error', response.message || 'Failed to read file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read file');
    }
  };

  const handleBreadcrumbPress = async (index: number) => {
    if (index === 0) {
      await loadDirectory('');
    } else {
      const newPath = currentPath.slice(1, index).join('/');
      await loadDirectory(newPath);
    }
  };

  const handleTerminalPress = () => {
    setIsTerminalVisible(true);
  };

  const handleTerminalClose = () => {
    setIsTerminalVisible(false);
  };

  const executeTerminalCommand = async (command: string) => {
    try {
      const response = await fileService.executeCommand(command, currentDirectory);

      if (response.success && response.new_path) {
        await loadDirectory(response.new_path);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to execute command'
      };
    }
  };


  useEffect(() => {
    loadDirectory();
  }, []);

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

          <BreadcrumbNavigation
            path={currentPath}
            onBreadcrumbPress={handleBreadcrumbPress}
          />

          <StorageInfo />

          {viewMode === 'grid' ? (
            <FileGrid
              files={files}
              onFilePress={(file) => handleFilePress(file as FileItem)}
              onTerminalPress={handleTerminalPress}
              loading={loading}
            />
          ) : (
            <FileList
              files={files}
              onFilePress={(file) => handleFilePress(file as FileItem)}
              onTerminalPress={handleTerminalPress}
              loading={loading}
            />
          )}

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      <Terminal
        visible={isTerminalVisible}
        onClose={handleTerminalClose}
        currentPath={currentDirectory}
        onExecuteCommand={executeTerminalCommand}
      />
    </View>
  );
}
