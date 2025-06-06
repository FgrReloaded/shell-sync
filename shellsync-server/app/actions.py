import os
import subprocess
import psutil
import json
from datetime import datetime
import mimetypes
from pathlib import Path

def lock_screen():
    try:
        subprocess.run(["loginctl", "lock-session"], check=True)
        return {"success": True, "message": "Screen locked successfully"}
    except subprocess.CalledProcessError:
        return {"success": False, "message": "Failed to lock screen"}

def unlock_screen():
    try:
        subprocess.run(["loginctl", "unlock-session"], check=True)
        return {"success": True, "message": "Screen unlocked successfully"}
    except subprocess.CalledProcessError:
        return {"success": False, "message": "Failed to unlock screen"}

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

def get_screen_lock_status():
    try:
        result = subprocess.run(
            [
                "gdbus", "call", "--session",
                "--dest", "org.gnome.ScreenSaver",
                "--object-path", "/org/gnome/ScreenSaver",
                "--method", "org.gnome.ScreenSaver.GetActive"
            ],
            capture_output=True, text=True, check=True
        )
        output = result.stdout.strip()
        if "true" in output:
            return {"success": True, "locked": True, "message": "Screen is locked."}
        elif "false" in output:
            return {"success": True, "locked": False, "message": "Screen is not locked."}
        else:
            return {"success": False, "message": f"Unexpected output from gdbus: {output}"}
    except subprocess.CalledProcessError as e:
        if "org.gnome.ScreenSaver" in e.stderr and ("does not exist" in e.stderr or "was not provided" in e.stderr):
             return {"success": True, "locked": False, "message": "Screensaver service not active (screen likely not locked or service unavailable)."}
        return {"success": False, "message": f"Failed to get screen lock status: {e.stderr}"}
    except FileNotFoundError:
        return {"success": False, "message": "gdbus command not found. Is it installed and in PATH?"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {str(e)}"}

def list_directory(path=""):
    """List files and folders in the specified directory"""
    try:
        if not path:
            path = os.path.expanduser("~")

        path = os.path.abspath(path)

        if not os.path.exists(path) or not os.path.isdir(path):
            return {"success": False, "message": "Directory not found"}

        files = []
        folders = []

        try:
            for item in os.listdir(path):
                item_path = os.path.join(path, item)

                if item.startswith('.'):
                    continue

                stat_info = os.stat(item_path)
                modified_time = datetime.fromtimestamp(stat_info.st_mtime).strftime("%Y-%m-%d")

                if os.path.isdir(item_path):
                    folders.append({
                        "id": item,
                        "name": item,
                        "type": "folder",
                        "size": None,
                        "modified": modified_time,
                        "icon": "📁",
                        "path": item_path
                    })
                else:
                    size = stat_info.st_size
                    size_str = format_file_size(size)

                    icon = get_file_icon(item)

                    files.append({
                        "id": item,
                        "name": item,
                        "type": "file",
                        "size": size_str,
                        "modified": modified_time,
                        "icon": icon,
                        "path": item_path
                    })

        except PermissionError:
            return {"success": False, "message": "Permission denied"}

        folders.sort(key=lambda x: x['name'].lower())
        files.sort(key=lambda x: x['name'].lower())

        return {
            "success": True,
            "path": path,
            "files": folders + files,
            "parent_path": os.path.dirname(path) if path != "/" else None
        }

    except Exception as e:
        return {"success": False, "message": str(e)}

def read_file_content(file_path):
    """Read the content of a text file"""
    try:
        file_path = os.path.abspath(file_path)

        if not os.path.exists(file_path) or not os.path.isfile(file_path):
            return {"success": False, "message": "File not found"}

        file_size = os.path.getsize(file_path)
        if file_size > 1024 * 1024:  # 1MB
            return {"success": False, "message": "File too large to read"}

        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type and not mime_type.startswith('text'):
            return {"success": False, "message": "File is not a text file"}

        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'cp1252']
        content = None

        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    content = f.read()
                break
            except UnicodeDecodeError:
                continue

        if content is None:
            return {"success": False, "message": "Could not decode file content"}

        return {
            "success": True,
            "content": content,
            "size": file_size,
            "encoding": encoding
        }

    except Exception as e:
        return {"success": False, "message": str(e)}

def format_file_size(size_bytes):
    """Convert bytes to human readable format"""
    if size_bytes == 0:
        return "0 B"

    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1

    return f"{size_bytes:.1f} {size_names[i]}"

def get_file_icon(filename):
    """Get appropriate icon for file based on extension"""
    extension = Path(filename).suffix.lower()

    icon_map = {
        '.txt': '📝', '.md': '📝', '.rtf': '📝',
        '.pdf': '📄', '.doc': '📄', '.docx': '📄',
        '.xls': '📊', '.xlsx': '📊', '.csv': '📊',
        '.ppt': '📊', '.pptx': '📊',
        '.jpg': '🖼️', '.jpeg': '🖼️', '.png': '🖼️', '.gif': '🖼️', '.bmp': '🖼️', '.svg': '🖼️',
        '.mp3': '🎵', '.wav': '🎵', '.flac': '🎵', '.m4a': '🎵',
        '.mp4': '🎬', '.avi': '🎬', '.mkv': '🎬', '.mov': '🎬', '.wmv': '🎬',
        '.zip': '🗜️', '.rar': '🗜️', '.7z': '🗜️', '.tar': '🗜️', '.gz': '🗜️',
        '.py': '🐍', '.js': '📜', '.html': '🌐', '.css': '🎨', '.json': '📋',
        '.exe': '⚙️', '.app': '⚙️', '.deb': '📦', '.rpm': '📦',
    }

    return icon_map.get(extension, '📄')

def execute_command(command, working_directory="", timeout=30):
    """Execute a terminal command in the specified directory"""
    try:
        # Security: Basic command filtering to prevent dangerous operations
        dangerous_commands = [
            'rm -rf /', 'sudo rm', 'format', 'fdisk', 'mkfs', 'dd if=', 'chmod 777 /',
            'chown -R', '> /dev/', 'wget http', 'curl http', 'nc -l', 'python -c',
            'eval', 'exec', 'system(', '__import__'
        ]

        command_lower = command.lower()
        for dangerous in dangerous_commands:
            if dangerous in command_lower:
                return {
                    "success": False,
                    "error": f"Command '{command}' is not allowed for security reasons"
                }

        # Set working directory
        if not working_directory:
            working_directory = os.path.expanduser("~")

        working_directory = os.path.abspath(working_directory)

        if not os.path.exists(working_directory) or not os.path.isdir(working_directory):
            return {"success": False, "error": "Working directory not found"}

        # Handle special built-in commands
        if command.strip() == 'pwd':
            return {"success": True, "output": working_directory}

        if command.strip().startswith('cd '):
            new_path = command.strip()[3:].strip()
            if new_path == '..':
                new_dir = os.path.dirname(working_directory)
            elif new_path.startswith('/'):
                new_dir = new_path
            else:
                new_dir = os.path.join(working_directory, new_path)

            new_dir = os.path.abspath(new_dir)
            if os.path.exists(new_dir) and os.path.isdir(new_dir):
                return {"success": True, "output": f"Changed directory to: {new_dir}", "new_path": new_dir}
            else:
                return {"success": False, "error": f"Directory '{new_path}' not found"}

        if command.strip() == 'help':
            help_text = """Available commands:
• ls, dir - List directory contents
• pwd - Show current directory
• cd <path> - Change directory
• cat <file> - Show file contents
• grep <pattern> <file> - Search in files
• find <name> - Find files by name
• ps - Show running processes
• df -h - Show disk usage
• free -h - Show memory usage
• uptime - Show system uptime
• whoami - Show current user
• date - Show current date/time
• clear - Clear terminal (use Clear button)

Note: Some system commands may be restricted for security.
For long-running commands like 'npm run dev', use Ctrl+C to stop."""
            return {"success": True, "output": help_text}

        # Check for long-running dev commands and adjust timeout
        dev_commands = ['npm run', 'pnpm run', 'yarn run', 'npm start', 'pnpm start', 'yarn start', 'serve', 'python -m http.server']
        is_dev_command = any(dev_cmd in command_lower for dev_cmd in dev_commands)

        if is_dev_command:
            # For dev commands, use a longer timeout but still limit it
            timeout = 120  # 2 minutes

        # Check if this might be a background service
        background_indicators = ['run dev', 'run start', 'serve', '-m http.server']
        is_background_service = any(bg in command_lower for bg in background_indicators)

        try:
            # For potentially long-running commands, give a warning
            if is_background_service:
                result = subprocess.run(
                    command,
                    shell=True,
                    cwd=working_directory,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    env=dict(os.environ, PWD=working_directory)
                )

                # If it returns quickly, it might have failed or started successfully
                output = result.stdout.strip()
                error = result.stderr.strip()

                if result.returncode == 0:
                    if output:
                        return {"success": True, "output": output}
                    else:
                        return {"success": True, "output": f"Command '{command}' started. Check if the service is running in the background."}
                else:
                    return {"success": False, "error": error if error else f"Command failed with exit code {result.returncode}"}
            else:
                result = subprocess.run(
                    command,
                    shell=True,
                    cwd=working_directory,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    env=dict(os.environ, PWD=working_directory)
                )

                output = result.stdout.strip()
                error = result.stderr.strip()

                if result.returncode == 0:
                    return {
                        "success": True,
                        "output": output if output else "Command executed successfully"
                    }
                else:
                    return {
                        "success": False,
                        "error": error if error else f"Command failed with exit code {result.returncode}"
                    }

        except subprocess.TimeoutExpired:
            if is_dev_command:
                return {
                    "success": False,
                    "error": f"Command timed out after {timeout} seconds. For long-running services like dev servers, consider running them in the background or use a dedicated terminal session."
                }
            else:
                return {"success": False, "error": f"Command timed out ({timeout} seconds limit)"}
        except Exception as e:
            return {"success": False, "error": f"Command execution failed: {str(e)}"}

    except Exception as e:
        return {"success": False, "error": f"Error: {str(e)}"}


