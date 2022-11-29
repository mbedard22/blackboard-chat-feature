from .. import sockio
from flask_socketio import send

#handles the messages coming into the server 
@sockio.on("message")
def handleMessage(msg):
    send(msg, broadcast=True)
    print(msg)
    