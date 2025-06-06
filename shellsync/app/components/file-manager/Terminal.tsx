import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface TerminalProps {
  visible: boolean;
  onClose: () => void;
  currentPath: string;
  onExecuteCommand: (command: string) => Promise<{ success: boolean; output?: string; error?: string }>;
}

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function Terminal({ visible, onClose, currentPath, onExecuteCommand }: TerminalProps) {
  const [currentCommand, setCurrentCommand] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const addToHistory = (line: TerminalLine) => {
    setHistory(prev => [...prev, line]);
  };

  const executeCommand = async () => {
    if (!currentCommand.trim()) return;

    const command = currentCommand.trim();

    addToHistory({
      type: 'command',
      content: `${getPrompt()} ${command}`,
      timestamp: new Date(),
    });

    setCommandHistory(prev => [command, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    try {
      const result = await onExecuteCommand(command);

      if (result.success && result.output) {
        addToHistory({
          type: 'output',
          content: result.output,
          timestamp: new Date(),
        });
      } else if (result.error) {
        addToHistory({
          type: 'error',
          content: result.error,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      addToHistory({
        type: 'error',
        content: 'Failed to execute command',
        timestamp: new Date(),
      });
    }

    setCurrentCommand('');
  };

  const getPrompt = () => {
    const pathDisplay = currentPath || '~';
    return pathDisplay;
  };

  const handleKeyPress = (event: any) => {
    const { key } = event.nativeEvent;

    if (key === 'Enter') {
      executeCommand();
    } else if (key === 'ArrowUp') {
      navigateHistory('up');
    } else if (key === 'ArrowDown') {
      navigateHistory('down');
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (direction === 'up' && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[newIndex]);
    } else if (direction === 'down' && historyIndex > -1) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(newIndex === -1 ? '' : commandHistory[newIndex]);
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [history]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingTop: Platform.OS === 'ios' ? 60 : 20,
              borderBottomWidth: 1,
              borderBottomColor: '#333333',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginRight: 8 }}>
                💻
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                Terminal
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={clearTerminal}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: '#333333',
                  marginRight: 12,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '500' }}>
                  Clear
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: '#DC2626',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '500' }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {history.length === 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#10B981', fontSize: 14, fontFamily: 'monospace' }}>
                  Welcome to ShellSync Terminal
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'monospace', marginTop: 4 }}>
                  Current directory: {currentPath || 'Home'}
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'monospace', marginTop: 4 }}>
                  Type &apos;help&apos; for available commands, or use standard shell commands.
                </Text>
              </View>
            )}

            {history.map((line, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                <Text
                  style={{
                    color: line.type === 'command' ? '#10B981' : line.type === 'error' ? '#EF4444' : '#E5E7EB',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    lineHeight: 18,
                  }}
                  selectable
                >
                  {line.content}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: "wrap",
              paddingHorizontal: 16,
              paddingVertical: 12,
              paddingBottom: Platform.OS === 'ios' ? 34 : 12,
              borderTopWidth: 1,
              borderTopColor: '#333333',
              backgroundColor: '#2A2A2A',
            }}
          >
            <Text
              style={{
                color: '#10B981',
                fontSize: 13,
                fontFamily: 'monospace',
                marginRight: 8,
              }}
            >
              {getPrompt()}
            </Text>

            <TextInput
              ref={inputRef}
              value={currentCommand}
              onChangeText={setCurrentCommand}
              onSubmitEditing={executeCommand}
              style={{
                flex: 1,
                color: '#FFFFFF',
                fontSize: 13,
                fontFamily: 'monospace',
                paddingVertical: 8,
              }}
              placeholder="Type a command..."
              placeholderTextColor="#6B7280"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="send"
              onKeyPress={handleKeyPress}
            />

            <TouchableOpacity
              onPress={executeCommand}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: '#10B981',
                marginLeft: 8,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                Run
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}