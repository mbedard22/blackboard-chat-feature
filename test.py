import sqlite3


connection = sqlite3.connect("app/livechat.db")
db = connection.cursor()

# db.execute("SELECT * FROM channels;")
# print(db.fetchall())



db.execute("INSERT INTO channels VALUES ('homework', 'cc');")
db.execute("INSERT INTO userChannels VALUES ('homework', 'gabrielvega@gmail.com');")
db.execute("INSERT INTO userChannels VALUES ('homework', 'mattbedard@gmail.com');")
db.execute("INSERT INTO userChannels VALUES ('homework', 'anthonylawlor@gmail.com');")
db.execute("INSERT INTO userChannels VALUES ('homework', 'andrewfarrell@gmail.com');")
# db.execute("INSERT INTO messages VALUES (1, '10/1/2022 11:24 pm', 'test from the db', 'gabrielvega@gmail.com', 'general');")


#schemas
# db.execute("CREATE TABLE channels(name TEXT, type TEXT);")
# db.execute("CREATE TABLE userChannels(channelName TEXT, userEmail TEXT);")
# db.execute("CREATE TABLE messages(id INTEGER PRIMARY KEY, timestamp TEXT, message TEXT, sender TEXT, channelId TEXT);")

connection.commit()
connection.close()