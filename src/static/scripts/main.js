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
			// Pass marker to map
			marker.setMap(map);
			// End of loop
		});
	});
});