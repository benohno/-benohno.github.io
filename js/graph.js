// set the dimensions and margins of the graph
var margin = {top: 10, right: 50, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y"),
    formatDate = d3.timeFormat("%d-%b"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var focus = svg.append("g") 
    .style("display", "none");

    

// Get the data
d3.csv("pacesetter_test.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.count = +d.count;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
    
    // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);
    
//Append mouseover circle

    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);

//// place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

// place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
    
// place rectangle to get mouse interaction
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
		    i = bisectDate(data, x0, 1),
		    d0 = data[i - 1],
		    d1 = data[i],
		    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        

		focus.select("circle.y")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.count) + ")");
        focus.select("text.y1")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.count) + ")")
		    .text(d.count);

		focus.select("text.y2")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.count) + ")")
		    .text(d.count);  
        
        focus.select("text.y3")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.count) + ")")
		    .text(formatDate(d.date));

		focus.select("text.y4")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.count) + ")")
		    .text(formatDate(d.date));    
        
        focus.select(".x")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.count) + ")")
		               .attr("y2", height - y(d.count));
        
		focus.select(".y")
		    .attr("transform",
		          "translate(" + width * -1 + "," +
		                         y(d.count) + ")")
		               .attr("x2", width + width);
    }


});