from flask import Blueprint, render_template, request, redirect, url_for
import sqlite3
from . import main

@main.route('/login', methods=('GET','POST'))
def login():
    if request.method == 'POST':
        return redirect(url_for('main.index', user=request.form["users"]))
    
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute("SELECT email, name FROM users")
    users = db.fetchall()
    connection.close()

    return render_template("login.html", title="Login", users=users)

@main.route('/home')
def index():
    user = request.args['user']
    return render_template("dashboard.html", title="Dashboard", user=user)

@main.route('/example-class')
def exampleClass():
    user = request.args['user']
    
    #pulls all the channels that the user is a part of
    cc, pc, gc = fetchUserChannels(user)
    admin = fetchUserPrivlage(user)

    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute("SELECT email, name FROM users")
    users = db.fetchall()
    connection.close()

    return render_template("class.html", title="Home Page -- COMP 4110", user=user, cc=cc, pc=pc, gc=gc, admin=admin, users=users)


def fetchUserChannels(user):
    classChannels = []
    groupChannels = []
    privateChannels = []

    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"SELECT channels.name, type FROM userChannels, channels WHERE userChannels.channelName = channels.name and userEmail = '{user}'")
    channels = db.fetchall()
    for channel in channels:
        if channel[1] == 'pc':
            privateChannels.append(channel[0])
        elif channel[1] == 'gc':
            groupChannels.append(channel[0])
        elif channel[1] == "cc":
            classChannels.append(channel[0])
    connection.close()

    return classChannels, privateChannels, groupChannels

def fetchUserPrivlage(user):
    connection = sqlite3.connect("app/livechat.db")
    db = connection.cursor()
    db.execute(f"SELECT admin FROM users WHERE email = '{user}'")
    return db.fetchall()[0][0]