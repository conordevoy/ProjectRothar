from flask import Flask, render_template, request, g
from flask.json import jsonify
import json
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
    return render_template("ProjectRothar.html")

@projectRotharApp.route("/historical_plot/<int:station_number>/<plot_day>")
def historical_plot(station_number, plot_day):
    '''Query db using station id and day.

    Return JSON object from query.
    '''
    # Connect to db and execute query
    g.db = connectDB()
    cur = g.db.execute("select last_update, available_bikes from projectRothar_DB WHERE status = \"OPEN\" AND number = %d AND Scrape_Day = \"%s\"" %(station_number, plot_day)) 
    # Create JSON object from query fetched
    data = json.dumps(cur.fetchall())
    # Close connection to db
    g.db.close() 
    return data

def connectDB():
    '''Create and return a db object to interact with'''
    return sqlite3.connect(projectRotharApp.db)

if __name__ == "__main__":
    # Start server with run method
    projectRotharApp.run()
