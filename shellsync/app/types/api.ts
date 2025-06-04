export interface HealthCheckResponse {
  msg: string;
  version: string;
  status: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface AppInfo {
  pid: number;
  name: string;
  cpu_percent: number;
  memory_percent: number;
}

export interface AppsResponse {
  apps: AppInfo[];
  error?: string;
}

export interface CpuInfo {
  usage_percent: number;
  count: number;
  frequency: number | null;
}

export interface MemoryInfo {
  total: number; // GB
  available: number; // GB
  used: number; // GB
  percent: number;
}

export interface DiskInfo {
  total: number; // GB
  used: number; // GB
  free: number; // GB
  percent: number;
}

export interface NetworkInfo {
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
}

export interface SystemInfoResponse {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo;
  network: NetworkInfo;
  boot_time: string; // ISO format string
  timestamp: string; // ISO format string
  error?: string;
}

export interface KillProcessPayload {
  pid: number;
}

export interface OpenAppPayload {
  app_name: string;
}

export interface ScreenLockStatusResponse extends ActionResult {
  locked?: boolean; // Will be true if screen is locked, false if not, undefined on error from backend before check
}
