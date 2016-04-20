$(document).ready(function() {
	// Function finds closest station to a lat and lng from an array of stations with available bikes and plots route to that station based on the travel mode used
	var locateAndRoute = function (markersArray, curLat, curLng, orLat, orLng, travelMethod, map) {
		// Find which station with bikes or spaces available (depends on marker array passed) is closest to lat: curLat, lng: curLng
		var distances = [];
		var closest = -1;
		// Loop through station array and find closest station.
		for (i = 0; i < markersArray.length; i++) {
			// Station lat and lng.
			var markerLatLng = new google.maps.LatLng(markersArray[i].position.lat(), markersArray[i].position.lng());
			// Current/destination lat and lng.
			var currentLatLng = new google.maps.LatLng(curLat, curLng);
			// Calculate and add distance between two points to array.
			var d = google.maps.geometry.spherical.computeDistanceBetween(markerLatLng, currentLatLng);
			distances[i] = d;
			// Reassign closest station index if condition met.
			if (closest == -1 || d < distances[closest]) {
				closest = i;
			}
		}
		// Render directions
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer({
			preserveViewport: true,
			polylineOptions:{ 
				strokeColor:"#ffffff",
				strokeWeight: 5
			} 
		});
		// Origin location
		var originLatLng = {lat: orLat, lng: orLng};
		// Destination location
		var destLatLng = {lat: markersArray[closest].position.lat(), lng: markersArray[closest].position.lng()};
		// Generate route from origin to destination (based on travel mode passed to function)
		directionsService.route({
			origin: new google.maps.LatLng(originLatLng), 
			destination: new google.maps.LatLng(destLatLng), 
			travelMode: travelMethod
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			} else {
				console.log("Request failed: " + status);
			}
		});
		// Display route on map	
		directionsDisplay.setMap(map);
	};

	// Create map
	var mapDiv = document.getElementById("map_canvas");
	// Map style array
	var styleArray = [
		{stylers: [{visibility: "off" }]},
		{featureType: "water", elementType: "geometry", stylers: [{visibility: "on" }, {color: "#808080"}, {lightness: 17}]},
		{featureType: "landscape", elementType: "geometry", stylers: [{visibility: "on"}, {color: "#042a2f" }, {lightness: 20}]},
		{featureType: "landscape", elementType: "labels.text.stroke", stylers: [{visibility: "on"}, {color: "#ffffff"}, {lightness: 16}]},
		{featureType: "road.highway", elementType: "geometry.fill", stylers: [{visibility: "on"}, {color: "#4DBBE9"}, {lightness: 17}]},
		{featureType: "road.highway", elementType: "labels.text.fill", stylers: [{visibility: "on"}, {saturation: 36}, {color : "#000000"}, {lightness : 16}]},
		{featureType: "road.highway", elementType: "labels.icon", stylers: [{visibility: "on"}]},
		{featureType: "road.arterial", elementType: "geometry", stylers: [{visibility: "on"}, {color : "#000000"}, {lightness : 16}]},
		{featureType: "road.arterial", elementType: "labels.text", stylers: [{visibility: "on"}, {color: "#000000"}, {lightness: 16}]},
		{featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{saturation: 36}, {color : "#808080"}, {lightness : 40}]},
		{featureType: "road.local", elementType: "geometry.stroke", stylers: [{visibility: "on"}, {color: "#000000"}, {lightness: 17}]},
		{featureType: "administrative.locality", elementType: "labels.text", stylers: [{visibility: "on"}, {color: "#000000"}, {lightness: 16}]},
		{featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{visibility: "on"}, {color: "#808080"}, {lightness: 40}]}
		];
	var mapOptions = {
		center: new google.maps.LatLng(53.347158, -6.262724), // Center map over Dublin
		zoom: 14,
		styles: styleArray,
		draggable: true,
		fullscreenControl: true,
		fullscreenControlOptions: {
			position : google.maps.ControlPosition.BOTTOM_LEF	
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(mapDiv, mapOptions);

	// Array: markers of stations with bikes available currently.
	var markersAvalBikes = [];
	// Array: markers of stations with spaces available currently.
	var markersAvalSpaces = [];

	// Request most recent update from API. 
	$.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=a85c8f0702b254af2e0bddaf3a12603cf19579e4", function(json) {
	/* Loop through JSON object: For each station: 
	* place markers, 
	* create and style infowindow, 
	* create circles (size and colour indicative of the number of bikes available at station) 
	*/
		$.each(json, function(key, data) {
			// Station lat and lng
			var latLng = new google.maps.LatLng(data.position.lat, data.position.lng);  
			// Create and set marker position 
			var marker = new google.maps.Marker({
				position: latLng,
				icon: "/static/images/bike.png",
				title: data.address,
				draggable: false,
			});
			// If condition met (bike(s) available), add station marker to array.
			if (data.available_bikes > 0){
				markersAvalBikes.push(marker);
			};
			// If condition met (space(s) available), add station marker to array.
			if (data.available_bike_stands > 0){
				markersAvalSpaces.push(marker);
			};
			// Check whether station has a card facility.
			var banking;
			if (data.banking){
				banking = "Available"
			} else{
				banking = "Unavailable"
			};
			// Convert timestamp to time of last update.
			var d = new Date(data.last_update);
			var hour = d.getHours();
			var min = ("0" + d.getMinutes()).slice(-2);
			var time = hour + ":" + min;

			// Station infowindow content
			var content = 	
			'<div id="iw-container">' +
			'<div class="iw-title">' + eval(JSON.stringify(data.address)) + '</div>' +
			'<div class="iw-content">' +
			'<div class="iw-subTitle">Station Information</div>' +
			'<ul>' + 
			'<li><strong>Station</strong><br>' + eval(JSON.stringify(data.status).toLowerCase()) + '</li><br>' + 
			'<li><strong>Available Bikes</strong><br>' + eval(JSON.stringify(data.available_bikes)) + '</li><br>' +
			'<li><strong>Available Spaces</strong><br>' + eval(JSON.stringify(data.available_bike_stands)) + '</li><br>' +
			'<li><strong>Card Machine</strong><br>' + banking + '</li><br>' +
			'<li><strong>Last Updated</strong><br>' + time + '</li><br>' +
            '<li><strong>Historical Plot:</strong></li>' +
			'</ul>' +
			'<ul id=days>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Mon">Mon</li>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Tue">Tue</li>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Wed">Wed</li>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Thu">Thu</li>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Fri">Fri</li>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Sat">Sat</li>'+
			'<li onclick="graphChart(this.id, this.textContent || this.innerText)" id="'+data.number+'" value="Sun">Sun</li>'+
			'</ul>' + 
			'</div>' +
			'</div>';
			// Create infowinfow
			var infowindow = new google.maps.InfoWindow({
				content: content,
				maxWidth: 350
			});
			// Display info window when marker clicked.
			google.maps.event.addListener(marker, "click", function() {
				//source: stackoverflow.com/questions/15111555/google-maps-api-v3-one-infowindow-open-at-a-time
				if($(".gm-style-iw").length) {
					$(".gm-style-iw").parent().remove();
				}
				infowindow.open(map, marker);
			});
			// Infowindow styling
			google.maps.event.addListener(infowindow, "domready", function() {
				// Reference div that wraps bottom of infowindow
				var iwOuter = $(".gm-style-iw");
				// Use jQuery to create a iwBackground variable, for div in position prior to .gm-div style-iw
				var iwBackground = iwOuter.prev();
				// Remove background shadow div
				iwBackground.children(":nth-child(2)").css({"display" : "none"});
				// Remove white background div
				iwBackground.children(":nth-child(4)").css({"display" : "none"});
				// Reference and style div of close button
				var iwCloseBtn = iwOuter.next();
				iwCloseBtn.css({opacity: "1", right: "38px", top: "3px", border: "7px solid #084c55", "border-radius": "13px"});
			});
			// Pass marker to map
			marker.setMap(map);

			// Decalre circle variables
			var circColour;
			var circRadius;
			// Colour and radius dependant on how bikes currently available.
			if (data.available_bikes/data.bike_stands >= 0.75){
				circColour = "#00e600";
				circRadius = 100;
			} else if (data.available_bikes/data.bike_stands >= 0.5){
				circColour = "#ffff00";
				circRadius = 75;
			} else if (data.available_bikes/data.bike_stands >= 0.25){
				circColour = "#ff9933";
				circRadius = 50;
			}else{
				circColour = "#ff0000";
				circRadius = 25;
			}
			// Set circle options
			var stationCircleOptions = {
				strokeColor: circColour,
				strokeOpacity: 0.8,
				strokeWeight: 2,
				clickable:true, 
				fillColor: circColour,
				fillOpacity: 0.35,
				center: latLng,
				radius: circRadius
			}
			// Pass circle object to map
			var drawStationCircle = new google.maps.Circle(stationCircleOptions);
			drawStationCircle.setMap(map);
			// End of loop
		});

		// Geolocation (source: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation)
		// Declare users current location variables
		var userLat;
		var userLng;
		// Try HTML5 geolocation
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				userLat = position.coords.latitude;
				userLng = position.coords.longitude;
				var geoLoc = {lat: userLat, lng: userLng};
				// User's location marker
				var marker = new google.maps.Marker({
					position: geoLoc,
					icon: "/static/images/person.png",
					title: "Current Location",
				});
				// Pass marker to map
				marker.setMap(map);
				// Locate and route to nearest station to user with available bikes (assumed travel mode walking because if user is looking for a bike).
				document.getElementById("locateNearestStation").addEventListener("click", function() {
					locateAndRoute (markersAvalBikes, userLat, userLng, userLat, userLng, google.maps.TravelMode.WALKING, map);
				});
			}, function() {
				handleLocationError(true, marker, map.getCenter());
			});
		} else { 
			// Browser doesn't support geolocation
			handleLocationError(false, marker, map.getCenter());
		}
		// Function to handle geolocation error
		function handleLocationError(browserHasGeolocation, marker, geoLoc) {
			marker.setPosition(geoLoc);
			// Browser has geolocation conditional
			marker.setContent(browserHasGeolocation ? "Error: geolocation service failed." : "Error: browser doesn\'t support geolocation.");
		}

		// Get directions to closest station to destination with available spaces
		var geocoder = new google.maps.Geocoder();
		document.getElementById("geocode").addEventListener("click", function() {
			// Retrieve destionation input value and use it to get lat and lng of destination.
			var dest = document.getElementById("destionation").value;
			// Add Dublin to input so geocoder chooses correct address
			geocoder.geocode({"address": dest + ", Dublin"}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var destLat = results[0].geometry.location.lat();
					var destLng = results[0].geometry.location.lng();
					// Locate and route to nearest station to destination with available spaces (assumed travel mode cycling because user will be using bike to get to destination).
					locateAndRoute (markersAvalSpaces, destLat, destLng, userLat, userLng, google.maps.TravelMode.BICYCLING, map);
				} else {
					window.alert("Geocode was not successful for the following reason: " + status);
				}
			});
		});
	});
});