'''
Created on 9 Mar 2016

@author: andrewpoole
'''
from time import sleep, strftime, gmtime
import sqlite3
import requests
import pandas as pd


def DBStationInfo(url):
    try:
        r = requests.get(url).json()
    except:
        print ("---- FAIL ----")
        return None
    return r

def dataframe(stationInfo):
    StationDetails_df = pd.DataFrame(stationInfo)
    StationDetails_df = StationDetails_df.drop(['bonus','contract_name'], axis=1)
    StationDetails_df['Scrape_Time'] = strftime("%H%M", gmtime())
    StationDetails_df.Scrape_Time = StationDetails_df.Scrape_Time.astype('int64')
    StationDetails_df['Scrape_Day'] = strftime("%a", gmtime())

    cateFeatures = StationDetails_df.select_dtypes(['object']).columns #Select all columns of type 'object'
    for col in cateFeatures:
        StationDetails_df[col] = StationDetails_df[col].astype('str')

    return StationDetails_df


if __name__ == "__main__":

    connDB = sqlite3.connect("projectRothar_DB.db")
    cursor = connDB.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS projectRothar_DB
                      (address text, available_bike_stands integer, available_bikes integer,
                       banking text, bike_stands integer, last_update integer, name text,
                       number integer, position real, status text, Scrape_Time integer, Scrape_Day text)
                   """)
    connDB.commit()

    url = "https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=a85c8f0702b254af2e0bddaf3a12603cf19579e4"
    weekSecs = 604800
    count = 1

    while weekSecs > 0:
        df = dataframe(DBStationInfo(url))

        df.to_sql(name="projectRothar_DB", con=connDB, flavor="sqlite", if_exists="append", index=False)
        connDB.commit()

        print (count)
        count += 1

        weekSecs -= 300
        sleep(300)

    df = pd.read_sql_query("SELECT * from projectRothar_DB", connDB)
    # print(df.head())
    dfCSV = df.to_csv('ProjectRotharDatabase.csv')

    connDB.close()