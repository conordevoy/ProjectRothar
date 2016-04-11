from flask import Flask, render_template, request, g
import sqlite3

# Application object (set different path for static files on the web)
projectRotharApp = Flask(__name__, static_url_path="/static")
# Enable debugging of app 
projectRotharApp.debug = True 

projectRotharApp.db = "projectRothar_DB.db"

# Decorator used to register a view function for the url rule parameter (Listens for only GET by default)
@projectRotharApp.route("/")
def ProjectRotharHTML():
	'''Render html template'''
	return render_template("ProjectRothar3.html")

def connectDB():
	'''Create and return a db object to interact with'''
	return sqlite3.connect(projectRotharApp.db)

if __name__ == "__main__":
	# Start server with run method
	projectRotharApp.run()