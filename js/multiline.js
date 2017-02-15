var noSeries = 0;
var valsPerSeries = 5;

var svg = d3.select('#chart1 svg');
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var color = d3.scale.category10();

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.energy); });


function drawLine(dataSet, len) {
    var ex = d3.extent(dataSet.values, function(d) {
        return d.energy;
    });
    // Scale the range of the data
    x.domain(d3.extent(dataSet.values, function(d) { return d.date; }));
    y.domain([ (ex[0] - 2), (ex[1] + 2) ]);

    var localG = g.append("g").attr("id", dataSet.site);
    localG.append("path")
        .datum(dataSet.values)
        .attr("fill", "none")
        .attr("stroke", color(Math.random(0, len)))
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line);

    localG.selectAll("circle")
        .data(dataSet.values)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(dd){return x(dd.date)})
        .attr("cy", function(dd){return y(dd.energy)})
        .attr("fill", "black")
        .attr("stroke", "black")

    localG.selectAll(".rect")
        .data(dataSet.values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.energy); })
        .attr("width", "5px")
        .attr("height", function(d) { return height - y(d.energy); });

}



d3.json("data.json", function(error, data) {
    var formattedData = formatData(data);
    var len = formattedData.length;
    formattedData.forEach(function(dataSet) {
        drawLine(dataSet, len);
    })

    y.domain([
        d3.min(formattedData, function(c) { return d3.min(c.values, function(v) { return v.energy; }); }),
        d3.max(formattedData, function(c) { return d3.max(c.values, function(v) { return v.energy; }); })
    ]);
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