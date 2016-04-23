# ProjectRothar
## Application Features

Repo holding code for our Dublin Bikes Software Development project.

![Application](/AppProgImgs/ProjectRother_v10.png)

This application has the following features:

1. Display dublinbike's station locations
2. Each station marker has a circle which gives a visual that indicates the percentage of bikes available i.e. the green larger circles mean a high percentage of bikes are available at the station.
3. When a marker is clicked, the user can see the station's most recent information such as available bikes, available spaces, whether there are card facilities and so on.
4. In the infowindow, the user can click on days of the week to view how many bikes are typically available throughout the day.

Above the map, there are two additional features:

1. The first allows the user to click a button and the app will find the closest station with available bikes to the user. Once the station is found, a route will display on the map from the user's location to the station.
2. The other feature assumes the user has a bike and wants to travel somewhere. When user enters the location of there destination, the app locates the nearest station with available spaces to the destination and displays a bike friendly route to that location.

## Run App
#### In terminal:
1. **Activate venv**:
  
  ```
  source venv/bin/activate
  ```
or **set up a virtualenv and pip install requirements.txt**:
  
  ```
  pip install -r requirements.txt
  ```
2. **Execute**:
  ```
  python3 ProjectRotharApp.py
  ```

3. **Run through Browser**:
  ```
  localhost:5000/
  ```

 
