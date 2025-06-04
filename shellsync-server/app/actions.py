import os
import subprocess
import psutil
import json
from datetime import datetime

def lock_screen():
    try:
        subprocess.run(["loginctl", "unlock-session"], check=True)
        return {"success": True, "message": "Screen locked successfully"}
    except subprocess.CalledProcessError:
        return {"success": False, "message": "Failed to lock screen"}

def list_apps():
    try:
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                pinfo = proc.info
                if pinfo['name'] and pinfo['name'] != 'kthreadd':
                    processes.append({
                        'pid': pinfo['pid'],
                        'name': pinfo['name'],
                        'cpu_percent': round(pinfo['cpu_percent'], 2),
                        'memory_percent': round(pinfo['memory_percent'], 2)
                    })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass

        processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
        return processes[:20]
    except Exception as e:
        return {"error": str(e)}

def get_system_info():
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        boot_time = datetime.fromtimestamp(psutil.boot_time())

        network = psutil.net_io_counters()

        return {
            "cpu": {
                "usage_percent": round(cpu_percent, 1),
                "count": psutil.cpu_count(),
                "frequency": psutil.cpu_freq().current if psutil.cpu_freq() else None
            },
            "memory": {
                "total": round(memory.total / (1024**3), 2),  # GB
                "available": round(memory.available / (1024**3), 2),  # GB
                "used": round(memory.used / (1024**3), 2),  # GB
                "percent": memory.percent
            },
            "disk": {
                "total": round(disk.total / (1024**3), 2),  # GB
                "used": round(disk.used / (1024**3), 2),  # GB
                "free": round(disk.free / (1024**3), 2),  # GB
                "percent": round((disk.used / disk.total) * 100, 1)
            },
            "network": {
                "bytes_sent": network.bytes_sent,
                "bytes_recv": network.bytes_recv,
                "packets_sent": network.packets_sent,
                "packets_recv": network.packets_recv
            },
            "boot_time": boot_time.isoformat(),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

def shutdown_system():
    try:
        subprocess.run(["shutdown", "-h", "now"], check=True)
        return {"success": True, "message": "System shutdown initiated"}
    except subprocess.CalledProcessError as e:
        return {"success": False, "message": f"Failed to shutdown: {str(e)}"}

def restart_system():
    try:
        subprocess.run(["reboot"], check=True)
        return {"success": True, "message": "System restart initiated"}
    except subprocess.CalledProcessError as e:
        return {"success": False, "message": f"Failed to restart: {str(e)}"}

def kill_process(pid):
    try:
        process = psutil.Process(pid)
        process.terminate()
        return {"success": True, "message": f"Process {pid} terminated successfully"}
    except psutil.NoSuchProcess:
        return {"success": False, "message": "Process not found"}
    except psutil.AccessDenied:
        return {"success": False, "message": "Access denied - insufficient permissions"}
    except Exception as e:
        return {"success": False, "message": str(e)}

def open_application(app_name):
    try:
        subprocess.Popen([app_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"success": True, "message": f"Application '{app_name}' launched"}
    except FileNotFoundError:
        return {"success": False, "message": f"Application '{app_name}' not found"}
    except Exception as e:
        return {"success": False, "message": str(e)}


