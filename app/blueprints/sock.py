from .. import sockio
from flask_socketio import send, emit
import sqlite3

#handles the messages coming into the server 
@sockio.on("message")
def handleMessage(msg):
    msgComp = msg.split(",")

    #checks to see if you should send message
    if msgComp[0] == "msg":
        send(msg, broadcast=True)

    #checks to see if someone is requesting a channel log
    if msgComp[0] == "retrieve":
        msg = retrieveMessages(msgComp[1])
        send(msg)


def retrieveMessages(channel):
    msgD = "retrieve,"
    
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"SELECT message, timestamp, sender FROM messages WHERE channelId = '{channel}';")
    ret = db.fetchall()
    for r in ret:
        msgD += f"{r[0]};{r[1]};{r[2]},"
    connection.close()

    return msgD[:-1]
