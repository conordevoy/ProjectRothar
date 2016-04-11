from Scrapper import *
import json

def test_API_connection():
	try:
		API_return_JSON = json.loads(DBStationInfo('https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=a85c8f0702b254af2e0bddaf3a12603cf19579e4'))
	print(API_return)
	# assert API_return == True;

test_API_connection()

def is_json(myjson):
  try:
    json_object = json.loads(myjson)
  except ValueError, e:
    return False
  return True