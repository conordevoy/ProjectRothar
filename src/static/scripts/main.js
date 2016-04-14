$(document).ready(function() {
	// Create map
	var mapDiv = document.getElementById("map_canvas");
	//Map style array
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
	});
});