from flask import Blueprint, jsonify, request
from .actions import (
    lock_screen, list_apps, get_system_info,
    shutdown_system, restart_system, kill_process, open_application
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
