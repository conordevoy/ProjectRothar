// Graph chart when day is clicked in infowindow
function graphChart(station_id, day){
	// Axis arrays
	var x = [];
	var	y = [];
	var chart = document.getElementById("chart_div");
	// Query sqlite3 db
	$.getJSON("/historical_plot/" + station_id + "/" + day , function(json) {
		// Construct arrays for chart construction by looping through response.
		$.each(json, function(key, data) {
			// Convert timestamp
			var d = new Date(data[0]);
			var hour = d.getHours();
			var min = ("0" + d.getMinutes()).slice(-2);
			var time = hour + ":" + min;
			// Populate arrays
			x.push(time);
			y.push(data[1]);
		});
		// Responsive chart (source: https://plot.ly/javascript/responsive-fluid-layout/)
		$(".js-plotly-plot").remove(); (function() {
			var d3 = Plotly.d3;
			// Sizing
			var widthPercOfPar = 95;
			var heigthVHOfPar = 50;
			var gd3 = d3.select("#content").append("div").style({
				width: widthPercOfPar + "%",
				"margin-left": (100 - widthPercOfPar) / 2 + "%",
				height: heigthVHOfPar + "vh",
				"margin-top": 20 + "px",
				"margin-bottom": 20 + "px"
			});
			var gd = gd3.node();
			// Plot line chart
			Plotly.newPlot(gd, [{
				type: "line", // bar
				x: x,
				y: y,
				marker: {
					color: "#ffffff",
					line: {
						width: 3
					}
				}
			}], 
			{
				title: "Times Series of Available Bikes on " + day + ".",
				font:{
					size:15,
					color: "#ffffff"
				},
				titlefont: {
					family: "Courier New, monospace",
					size: 22,
					color: "#ffffff"
				},
				xaxis: {
					title: "Time",
					titlefont: {
						family: "Courier New, monospace",
						size: 18,
						color: "#ffffff"
					},
				},
				yaxis: {
					title: "Bikes Available",
					titlefont: {
						family: "Courier New, monospace",
						size: 18,
						color: "#ffffff"
					},
				},
				paper_bgcolor: "#084c55",
				plot_bgcolor: "#084c55"
			});
			window.onresize = function() {
				Plotly.Plots.resize(gd);
			};
		}) ();
	});	
}