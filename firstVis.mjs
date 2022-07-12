		//import  gun_data_by_state data
		import gun_data from "./guns_grouped.json" assert { type: "json" };
		const width = 800;
		const height = 540;
		
			// parse the json file to the right data types
			var gunDataParsed= gun_data.map(item=>{
				return {
                "state": item.state,
				"n_killed": Number(item.n_killed) ? Number(item.n_killed) : item.n_killed,
				"n_injured": Number(item.n_injured) ? Number(item.n_injured) : item.n_injured,
				"incidents": Number(item.incidents) ? Number(item.incidents) : item.incidents,
                "latitude": Number(item.latitude) ? Number(item.latitude) : item.latitude,
				"longitude": Number(item.longitude) ? Number(item.longitude) : item.longitude,
				"has_guns":Number(item.has_guns) ? Number(item.has_guns) : item.has_guns,
				"no_guns":Number(item.no_guns) ? Number(item.no_guns) : item.no_guns
            };
			});
			
		//Calculate the maximum and minimum value for the number of killed people in every  state
		let max = d3.max(gunDataParsed, function (d, i) {
			return d.n_killed;
			});
		let min = d3.min(gunDataParsed, function (d, i) {
			return d.n_killed;
		});
		
		//Create an svg element
		const svg = d3.select(".home").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr('id','map');
		//Create a projection of the USA states 
		const projection = d3.geoAlbersUsa()
			.translate([width / 2, height / 2]) // translate to center of screen
			.scale([1000]); // scale things down so see entire US
		 //Create a path with those projections
		const path = d3.geoPath().projection(projection);
		

		//Calculate the domain to scale the colors of every state according to n_killed max an min values
		let domain = [min,((min+max)/2).toFixed(2),((min+max)/3).toFixed(2),max];
		//Sort the values in ascending order
		let sortetd_domain=domain.sort(function(a, b){return a - b});
		
		//create a color scale from yellow to red according to the n_killed domain values
		const colorScale = d3.scaleLinear()
			.domain(domain)
			.range(["#FFFF00", "#FF8000","#FF5500", "#FF0000"]);
	

		//Create svg for the pie chart
		var pie_width=(359)
		var pie_height=(height)
		var radius=height/4
		var pie_chart = d3.select(".home").append("svg")
							.attr("width", pie_width)
							.attr("height", pie_height)
							.attr('id','pie_chart')
							.attr("transform", "translate("+0+","+0+")")
							.append('g')
								.attr('id','pie_g')
								.attr("transform", "translate(" + 150 + "," + height / 2 + ")");
							
		 
		 //Read the us states properties
		d3.json("https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json", function(error, uState) {
			// create a tooltip
			var tooltip = d3.select("#homeid")
				.append("div")
				.attr("id", "tooltip")
				.style("opacity", 0)
				.style("position","fixed")

			var mouseover = function(d) {
			tooltip.style("opacity", 1)
		  }
		  var mousemove = function(d) {
			tooltip
			  .html("The exact value of<br>this cell is: " + d.value)
			  .style("left", (d3.mouse(this)[0]+70) + "px")
			  .style("top", (d3.mouse(this)[1]) + "px")
		  }
		  var mouseleave = function(d) {
			tooltip.style("opacity", 0)
		  }
			
			//Merge the guns_data and us_states data to the same object according to states' names
			_(uState.features)
				.keyBy('properties.name')
				.merge(_.keyBy(gunDataParsed, 'state'))
				.values()
				.value();
			if (error) throw error;
			//Create USA states map
				svg.selectAll('path')
					.data(uState.features)
					.enter()
					.append('path')
					.attr("d", path)
					.attr('class', 'state')
					.style('stroke','#000000')
					//color every state according to the number of killed people in gun violence incidents
					.style('fill', function (d, i) {
						let killed = d.n_killed;
							return killed ? colorScale(killed) : "#ccc";
					})
									//add CSS transition styling
					.style('transition', "all 0.2s ease-in-out")
					.attr('class', 'state')
					.style('fill', function (d, i) {
						let killed = d.n_killed;
						return killed ? colorScale(killed) : "#ccc";
					})
					 .on('mousemove', function (d) {
						d3.select("#tooltip").transition()
							.duration(200)
							.style("opacity", .9)
							tooltip
							.html("<u>State:</u> "+d.state+
								"<br><u>Killed:</u>"+d.n_killed+
								"<br><u>Injured:</u> "+d.n_injured+
								"<br><u>Cases:</u> "+d.incidents)
							.style("left", (d3.event.x + 10) + "px")
							.style("top", (d3.event.y + 10) + "px")
							tooltip.style("display", "block")
							.style("border", "solid")
							.style("border-width", "2px")
							.style("border-radius", "5px")
                 

                })
					//Change the color of the state when the mouse is on it
					.on("mouseover", function (d, event) {
						d3.select(this)
							.style("fill", tinycolor(colorScale(d.n_killed)).darken(15).toString())
							.style("cursor", "pointer")
							tooltip.style("opacity", 1)
							
							
					})
					
					//Change the color of the state back to normal when the mouse is removed
					.on("mouseout", function (d, i) {
						d3.select(this).style("fill", function () {
							let killed = d.n_killed;
							return killed ? colorScale(killed) : "#ccc";
						})
						tooltip.style("display", "none")
						
					})
					//On click function for every state to create a pie chart
					.on('click', function(d) {
						var data=[d.has_guns,d.no_guns];
						var state_name=d.state
						var color=['#bf0a30','#002868'];
						d3.select(".pie_title").remove();
						// Compute the position of each group on the pie:
						var pie = d3.pie()
						  .value(function(d) {return d.value; })
						var data_ready = pie(d3.entries(data))
						var arc= d3.arc()
									.innerRadius(0)
									.outerRadius(radius);
						var arcs= d3.select('#pie_g').selectAll('arc')
										.data(pie(data_ready))
										.enter()
										.append('g')
										.attr('class','arc')
										
										
						arcs.append('path')
							.style('fill',function (d,i) {return color[i]})
							.attr('d',arc)
							.attr('class','arc')
							.style('stroke-width',4)
						
						// Now add the annotation. Use the centroid method to get the best coordinates
						var titles=['Owns Guns','Without Guns']
						d3.select('#pie_g')
						  .selectAll('arc')
						  .data(data_ready)
						  .enter()
						  .append('text')
						  .html(function(d,i){ return "<tspan fill='#ffffff' x='0' dy='1.2em'>"+ titles[i]+"</tspan>"
														+ "<tspan fill='#ffffff' x='0' dy='1.2em'>"+d.value+'%'+"</tspan>"})
						  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
						  .style("text-anchor", "middle")
						  .style("font-size", 17)
						
						// append title
						d3.select("#pie_chart").append("text")
						.attr("class", "pie_title")
						.attr("x", (pie_width/3)-70)
						.attr("y", 90)
						.style("text-anchor", "left")
						.html("<tspan x='50' dy='1.2em'>"+ "Percentage of Gun Owners (2021)"+"</tspan>"
														+ "<tspan x='120' dy='1.2em'>"+state_name+"</tspan>");
					})
										
					
		});
  
			  
			//Create svg element for map's legend
			d3.select("#map")
			  .append("svg")
			  .attr("class", "legend")
			  .attr("x", (width/3))
			  .attr("y", (20))
			  .style('stroke','black')
			  .style('stroke-width',0.8)
			  .style('font-size',14);
			  
			//Create a color legend
			var legend = d3.legendColor()
			  .shapeHeight(10)
			  .shapeWidth(70)
			  .shapePadding(0)
			  .labelOffset(5)
			  .labelFormat(d3.format(".1f"))
			  .orient("horizontal")
			  .labelAlign("start")
			  .scale(colorScale);
			//Use the color legend  
			d3.select(".legend").call(legend);
			
			// append legend's title
			d3.select("#map").append("text")
			  .attr("class", "legendTitle")
			  .attr("x", (width/2)+20)
			  .attr("y", (12))
			  .style("text-anchor", "left")
			  .style('stroke','black')
			  .style('stroke-width',0.8)
			  .style('font-size',16)
			  .text("Killed");	
