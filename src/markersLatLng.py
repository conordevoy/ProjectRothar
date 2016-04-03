import pandas as pd

csv_df = pd.read_csv('ProjectRotharDatabase.csv')

# Split out location column into a latitude and longitude column
csv_df["latitude"] = csv_df["position"].str.extract('(\d*[0-9]\.\d*[0-9])')
csv_df["longitude"] = csv_df["position"].str.extract('(-\d*[0-9]\.\d*[0-9])')

# Marker Info: create JSON file
marker_df = csv_df.ix[0:100, ["address", "latitude", "longitude"]]
marker_json = marker_df.to_json(
    "./static/data/markersJSON.json", orient="records")
# orient =
# split : dict like {index -> [index], columns -> [columns], data -> [values]}
# records : list like [{column -> value}, ... , {column -> value}]
# index : dict like {index -> {column -> value}}
# columns : dict like {column -> {index -> value}}
# values : just the values array
