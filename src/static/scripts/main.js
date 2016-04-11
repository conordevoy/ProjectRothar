$(document).ready(function() {
	// Create map
	var mapDiv = document.getElementById("map_canvas");
	var mapOptions = {
		center: new google.maps.LatLng(53.347158, -6.262724), // Center map over Dublin
		zoom: 14,
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
	});
});