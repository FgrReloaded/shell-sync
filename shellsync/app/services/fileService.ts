import { API_BASE_URL } from '../constants/apiConfig';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string | null;
  modified: string;
  icon: string;
  path: string;
  relative_path?: string;
}

export interface DirectoryResponse {
  success: boolean;
  path?: string;
  files?: FileItem[];
  parent_path?: string;
  message?: string;
}

export interface SearchResponse {
  success: boolean;
  query?: string;
  search_path?: string;
  results?: FileItem[];
  message?: string;
}

export interface FileContentResponse {
  success: boolean;
  content?: string;
  size?: number;
  encoding?: string;
  message?: string;
}

export interface ExecuteCommandResponse {
  success: boolean;
  output?: string;
  error?: string;
  new_path?: string;
}

export const fileService = {
  async listDirectory(path: string = ''): Promise<DirectoryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/files?path=${encodeURIComponent(path)}`);
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to connect to server' };
    }
  },

  async searchFiles(query: string, path: string = ''): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?query=${encodeURIComponent(query)}&path=${encodeURIComponent(path)}`
      );
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to connect to server' };
    }
  },

  async readFile(filePath: string): Promise<FileContentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/read-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: filePath }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to connect to server' };
    }
  },

  async executeCommand(
    command: string,
    workingDirectory: string = ''
  ): Promise<ExecuteCommandResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          working_directory: workingDirectory,
        }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to connect to server' };
    }
  },
};
