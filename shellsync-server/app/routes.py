from flask import Blueprint, jsonify, request
from .actions import (
    lock_screen, list_apps, get_system_info,
    shutdown_system, restart_system, kill_process, open_application,
    get_screen_lock_status,
    unlock_screen,
    list_directory, read_file_content, execute_command
)

main = Blueprint('main', __name__)

@main.route("/")
def health_check():
    return jsonify({
        "msg": "Shell Sync Server is running!",
        "version": "1.0.0",
        "status": "healthy"
    })

@main.route("/lock", methods=["POST"])
def lock():
    result = lock_screen()
    return jsonify(result)

@main.route("/unlock", methods=["POST"])
def unlock():
    result = unlock_screen()
    return jsonify(result)

@main.route("/apps")
def apps():
    apps_list = list_apps()
    return jsonify({"apps": apps_list})

@main.route("/system")
def system():
    system_info = get_system_info()
    return jsonify(system_info)

@main.route("/shutdown", methods=["POST"])
def shutdown():
    result = shutdown_system()
    return jsonify(result)

@main.route("/restart", methods=["POST"])
def restart():
    result = restart_system()
    return jsonify(result)

@main.route("/kill-process", methods=["POST"])
def kill_proc():
    data = request.get_json()
    pid = data.get('pid')

    if not pid:
        return jsonify({"success": False, "message": "PID is required"}), 400

    try:
        pid = int(pid)
        result = kill_process(pid)
        return jsonify(result)
    except ValueError:
        return jsonify({"success": False, "message": "Invalid PID format"}), 400

@main.route("/open-app", methods=["POST"])
def open_app():
    data = request.get_json()
    app_name = data.get('app_name')

    if not app_name:
        return jsonify({"success": False, "message": "App name is required"}), 400

    result = open_application(app_name)
    return jsonify(result)

@main.route("/screen-status", methods=["GET"])
def screen_status():
    result = get_screen_lock_status()
    return jsonify(result)

@main.route("/files", methods=["GET"])
def list_files():
    path = request.args.get('path', '')
    result = list_directory(path)
    return jsonify(result)

@main.route("/read-file", methods=["POST"])
def read_file():
    data = request.get_json()
    file_path = data.get('file_path')

    if not file_path:
        return jsonify({"success": False, "message": "File path is required"}), 400

    result = read_file_content(file_path)
    return jsonify(result)

@main.route("/execute", methods=["POST"])
def execute():
    data = request.get_json()
    command = data.get('command')
    working_directory = data.get('working_directory', '')
    timeout = data.get('timeout', 30)  # Default 30 seconds, can be customized

    if not command:
        return jsonify({"success": False, "error": "Command is required"}), 400

    result = execute_command(command, working_directory, timeout)
    return jsonify(result)


