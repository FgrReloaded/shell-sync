from flask import Flask

def create_server():
    app = Flask(__name__)

    from .routes import main
    app.register_blueprint(main)

    return app
