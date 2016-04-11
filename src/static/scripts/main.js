$(document).ready(function() {
	// Create map
	var mapDiv = document.getElementById("map_canvas");
	// Map style array
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
});