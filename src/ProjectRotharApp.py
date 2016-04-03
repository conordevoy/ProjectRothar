from flask import Flask, render_template, request

# application object
projectRotharApp = Flask(__name__, static_url_path='/static')
projectRotharApp.debug = True #turn debug mode on

# set up first route. Use a decorator to join a url to a function
@projectRotharApp.route("/")
def ProjectRotharHTML():
	'''Render full html template'''
	return render_template("ProjectRothar.html")#need to create the ProjectRothar.html file

if __name__ == "__main__":
	projectRotharApp.run()#start server with run method