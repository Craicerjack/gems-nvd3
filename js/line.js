// Set the dimensions of the canvas / graph
var svg = d3.select("#chart svg");
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
 
// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
 
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
 
// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.energy); });
 
    
d3.json("data.json", function(data) {
    var formattedData = formatData(data)

    var plot1 = formattedData[0];
    var ex = d3.extent(plot1.values, function(d) {
        return d.energy;
    });
    // Scale the range of the data
    x.domain(d3.extent(plot1.values, function(d) { return d.date; }));
    y.domain([ (ex[0] - 10), (ex[1] + 5) ]);
 
    g.append("path")
        .datum(plot1.values)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", valueline);
 
    // Add the X Axis
    g.append("g")     
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
 
    // Add the Y Axis
    g.append("g")     
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")

});

