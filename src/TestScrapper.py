from Scrapper import *
import json

def test_API_connection():
	API_return = DBStationInfo('https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=a85c8f0702b254af2e0bddaf3a12603cf19579e4')
	print(API_return)

test_API_connection()