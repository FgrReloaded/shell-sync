import { API_BASE_URL } from '../constants/apiConfig';
import {
  HealthCheckResponse,
  ActionResult,
  AppsResponse,
  SystemInfoResponse,
  KillProcessPayload,
  OpenAppPayload,
  ScreenLockStatusResponse,
} from '../types/api';

const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(response.statusText || 'Network response was not ok');
    }
    throw new Error(errorData?.message || response.statusText || 'Network response was not ok');
  }
  return response.json() as Promise<T>;
};

export const healthCheck = (): Promise<HealthCheckResponse> => {
  return request<HealthCheckResponse>('/');
};

export const lockScreen = (): Promise<ActionResult> => {
  return request<ActionResult>('/lock', { method: 'POST' });
};

export const unlockScreen = (): Promise<ActionResult> => {
  return request<ActionResult>('/unlock', { method: 'POST' });
};

export const listApps = (): Promise<AppsResponse> => {
  return request<AppsResponse>('/apps');
};

export const getSystemInfo = (): Promise<SystemInfoResponse> => {
  return request<SystemInfoResponse>('/system');
};

export const shutdownSystem = (): Promise<ActionResult> => {
  return request<ActionResult>('/shutdown', { method: 'POST' });
};

export const restartSystem = (): Promise<ActionResult> => {
  return request<ActionResult>('/restart', { method: 'POST' });
};

export const killProcess = (payload: KillProcessPayload): Promise<ActionResult> => {
  return request<ActionResult>('/kill-process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const openApplication = (payload: OpenAppPayload): Promise<ActionResult> => {
  return request<ActionResult>('/open-app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const getScreenLockStatus = (): Promise<ScreenLockStatusResponse> => {
  return request<ScreenLockStatusResponse>('/screen-status');
};
