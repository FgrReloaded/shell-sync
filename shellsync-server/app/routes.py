from flask import Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route("/")
def apps():
    return jsonify({"success": "true"})
