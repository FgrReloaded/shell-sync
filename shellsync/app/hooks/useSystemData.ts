import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { SystemInfoResponse, AppInfo, AppsResponse } from '../types/api';

interface UseSystemDataOutput {
  systemInfo: SystemInfoResponse | null;
  apps: AppInfo[];
  isLoadingSystemInfo: boolean;
  isLoadingApps: boolean;
  errorSystemInfo: Error | null;
  errorApps: Error | null;
  refreshAll: () => Promise<void>;
  killApp: (pid: number) => Promise<api.ActionResult>;
  openApp: (appName: string) => Promise<api.ActionResult>;
  lockUserScreen: () => Promise<api.ActionResult>;
  shutdownUserSystem: () => Promise<api.ActionResult>;
  restartUserSystem: () => Promise<api.ActionResult>;
}

const REFRESH_INTERVAL = 5000; // 5 seconds

export const useSystemData = (): UseSystemDataOutput => {
  const [systemInfo, setSystemInfo] = useState<SystemInfoResponse | null>(null);
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [isLoadingSystemInfo, setIsLoadingSystemInfo] = useState<boolean>(true);
  const [isLoadingApps, setIsLoadingApps] = useState<boolean>(true);
  const [errorSystemInfo, setErrorSystemInfo] = useState<Error | null>(null);
  const [errorApps, setErrorApps] = useState<Error | null>(null);

  const fetchSystemInfo = useCallback(async () => {
    setIsLoadingSystemInfo(true);
    setErrorSystemInfo(null);
    try {
      const data = await api.getSystemInfo();
      if (data.error) throw new Error(data.error);
      setSystemInfo(data);
    } catch (err) {
      setErrorSystemInfo(err as Error);
    }
    setIsLoadingSystemInfo(false);
  }, []);

  const fetchApps = useCallback(async () => {
    setIsLoadingApps(true);
    setErrorApps(null);
    try {
      const data = await api.listApps();
      if (data.error) throw new Error(data.error);
      setApps(data.apps || []);
    } catch (err) {
      setErrorApps(err as Error);
    }
    setIsLoadingApps(false);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchSystemInfo(), fetchApps()]);
  }, [fetchSystemInfo, fetchApps]);

  useEffect(() => {
    refreshAll();
    const intervalId = setInterval(refreshAll, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [refreshAll]);

  const killApp = async (pid: number): Promise<api.ActionResult> => {
    const result = await api.killProcess({ pid });
    if (result.success) {
      // Optimistically remove from list or wait for next refresh
      setApps((prevApps) => prevApps.filter((app) => app.pid !== pid));
    }
    return result;
  };

  const openApp = async (appName: string): Promise<api.ActionResult> => {
    return api.openApplication({ app_name: appName });
    // Consider refreshing app list after opening, though it might not appear immediately
  };

  const lockUserScreen = async (): Promise<api.ActionResult> => {
    return api.lockScreen();
  };

  const shutdownUserSystem = async (): Promise<api.ActionResult> => {
    return api.shutdownSystem();
  };

  const restartUserSystem = async (): Promise<api.ActionResult> => {
    return api.restartSystem();
  };

  return {
    systemInfo,
    apps,
    isLoadingSystemInfo,
    isLoadingApps,
    errorSystemInfo,
    errorApps,
    refreshAll,
    killApp,
    openApp,
    lockUserScreen,
    shutdownUserSystem,
    restartUserSystem,
  };
};
