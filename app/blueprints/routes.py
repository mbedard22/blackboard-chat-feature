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
    return render_template("class.html", title="Home Page -- COMP 4110", user=user)