from flask import Flask
from flask_socketio import SocketIO

sockio = SocketIO()

def create_app():
    app = Flask(__name__)

    from .blueprints import main as main_blueprints
    app.register_blueprint(main_blueprints)
    sockio.init_app(app, cors_allowed_origins="*")
    
    return app





