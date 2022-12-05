import sqlite3


connection = sqlite3.connect("app/livechat.db")
db = connection.cursor()

# db.execute("drop table users")
# db.execute("drop table channels")
# db.execute("drop table userChannels")
# db.execute("drop table messages")

db.execute("select * from userChannels")
print(db.fetchall())



# db.execute("INSERT INTO channels VALUES ('general', 'cc');")
# db.execute("INSERT INTO channels VALUES ('homework', 'cc');")
# db.execute("INSERT INTO userChannels VALUES ('homework', 'gabrielvega@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('homework', 'mattbedard@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('homework', 'anthonylawlor@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('homework', 'andrewfarrell@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('general', 'gabrielvega@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('general', 'mattbedard@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('general', 'anthonylawlor@gmail.com');")
# db.execute("INSERT INTO userChannels VALUES ('general', 'andrewfarrell@gmail.com');")
# db.execute("INSERT INTO messages VALUES (1, '10/1/2022 11:24 pm', 'test from the db', 'gabrielvega@gmail.com', 'general', 0);")
# db.execute("INSERT INTO messages VALUES (2, '10/1/2022 11:24 pm', 'test from the db', 'gabrielvega@gmail.com', 'homework', 0);")
# db.execute("INSERT INTO users VALUES ('gabrielvega@gmail.com', 'gabriel vega', 1);")
# db.execute("INSERT INTO users VALUES ('mattbedard@gmail.com', 'matt bedard', 0);")
# db.execute("INSERT INTO users VALUES ('anthonylawlor@gmail.com', 'anthony lawlor', 0);")
# db.execute("INSERT INTO users VALUES ('andrewfarrell@gmail.com', 'andrew arrell', 0);")

#schemas
# db.execute("CREATE TABLE channels(name TEXT, type TEXT);")
# db.execute("CREATE TABLE userChannels(channelName TEXT, userEmail TEXT);")
# db.execute("CREATE TABLE messages(id INTEGER PRIMARY KEY, timestamp TEXT, message TEXT, sender TEXT, channelId TEXT, deleted INTEGER);")
# db.execute("CREATE TABLE users(email TEXT PRIMARY KEY, name TEXT, admin INTEGER);")

connection.commit()
connection.close()