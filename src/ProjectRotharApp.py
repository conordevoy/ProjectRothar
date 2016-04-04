from flask import Flask, render_template, request, g
import sqlite3

# application object
projectRotharApp = Flask(__name__, static_url_path='/static')
projectRotharApp.debug = True #turn debug mode on

projectRotharApp.db = "projectRothar_DB.db"

# set up first route. Use a decorator to join a url to a function
@projectRotharApp.route("/")
def ProjectRotharHTML():
	'''Render full html template'''
	g.db = connectDB()# establish connection to database
	cur = g.db.execute("select * from projectRothar_DB where Scrape_Time = 1358 AND Scrape_Day = 'Fri';")# fetch data from database (where Scrape_Time = 1358 AND Scrape_Day = 'Fri';)
	data = [dict(address=row[0], available_bike_stands=row[1], available_bikes=row[2], banking=row[3], Scrape_Time=row[9], Scrape_Day=row[10]) for row in cur.fetchall()]# cast fetched data to dictionary
	g.db.close() # close database	
	return render_template("ProjectRothar.html", data=data)# render template and pass the variable to template 

# create db object to interact with
def connectDB():
	return sqlite3.connect(projectRotharApp.db)

if __name__ == "__main__":
	projectRotharApp.run()#start server with run method
	# from tornado.wsgi import WSGIContainer
	# from tornado.httpserver import HTTPServer
	# from tornado.ioloop import IOLoop

	# http_server = HTTPServer(WSGIContainer(projectRotharApp))
	# http_server.listen(5000)
	# IOLoop.instance().start()