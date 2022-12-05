from .. import sockio
from flask_socketio import send, emit
import sqlite3


#handles the messages coming into the server 
@sockio.on("message")
def handleMessage(msg):
    msgComp = msg.split(",")

    #checks to see if you should send message
    if msgComp[0] == "msg":
        storeMessage(msgComp)
        send(msg, broadcast=True)

    #checks to see if someone is requesting a channel log
    if msgComp[0] == "retrieve":
        msg = retrieveMessages(msgComp[1])
        send(msg)

    if msgComp[0] == "create":
        if msgComp[1] == 'cc':
            createClassChannel(msgComp[2])
        elif msgComp[1] == 'pc':
            createPrivateChannel(msgComp[2], msgComp[3:])
        elif msgComp[1] == 'gc':
            createGroupChannel(msgComp[2], msgComp[3:])

    if msgComp[0] == "remove":
        connection = sqlite3.connect("app/livechat.db")
        db = connection.cursor()
        db.execute(f"DELETE FROM channels WHERE name = '{msgComp[1]}'")
        db.execute(f"DELETE FROM userChannels WHERE channelName = '{msgComp[1]}'")

        connection.commit() 
        connection.close()

    if msgComp[0] == "admin":
        for i in range(int((len(msgComp)-1)/2)):
            connection = sqlite3.connect("app/livechat.db")
            db = connection.cursor()
            updateQuery = f"UPDATE users SET admin = {msgComp[(i*2)+2]} WHERE email = '{msgComp[(i*2)+1]}'"
            db.execute(updateQuery)
            connection.commit() 
            connection.close()

    if msgComp[0] == "delete":
        connection = sqlite3.connect("app/livechat.db")
        db = connection.cursor()
        db.execute(f"UPDATE messages SET deleted = 1 WHERE timestamp = '{msgComp[3]}' AND message = '{msgComp[4]}' AND sender = '{msgComp[2]}' AND channelId = '{msgComp[1]}'")
        connection.commit() 
        connection.close()


def retrieveMessages(channel):
    msgD = "retrieve,"
    
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"SELECT message, timestamp, sender, deleted FROM messages WHERE channelId = '{channel}';")
    ret = db.fetchall()
    for r in ret:
        msgD += f"{r[0]};{r[1]};{r[2]};{r[3]},"
    connection.close()

    return msgD[:-1]

def storeMessage(msgComp):
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"SELECT max(id) FROM messages;")
    id = db.fetchall()[0][0] + 1
    db.execute(f"INSERT INTO messages VALUES ({id}, '{msgComp[2]}', '{msgComp[3]}', '{msgComp[1]}', '{msgComp[4]}', 0);")   
    connection.commit() 
    connection.close()

def createClassChannel(channelName):
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute("SELECT email FROM users")
    users = db.fetchall()
    db.execute(f"INSERT INTO channels VALUES('{channelName}', 'cc');")
    for user in users:
        db.execute(f"INSERT INTO userChannels VALUES('{channelName}', '{user[0]}');")
    connection.commit() 
    connection.close()

def createPrivateChannel(channelName, users):
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"INSERT INTO channels VALUES('{channelName}', 'pc');")
    for user in users:
        db.execute(f"INSERT INTO userChannels VALUES('{channelName}', '{user}');")
    connection.commit() 
    connection.close()

def createGroupChannel(channelName, users):
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"INSERT INTO channels VALUES('{channelName}', 'gc');")
    for user in users:
        db.execute(f"INSERT INTO userChannels VALUES('{channelName}', '{user}');")
    connection.commit() 
    connection.close()
