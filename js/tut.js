var margin = {top: 20, right: 80, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var line = d3.line().curve(d3.curveCardinal.tension(0.3)).x(function(d) { return x(d.date); }).y(function(d) { return y(d.energy); });


function drawSingleLineGraph(url, id) {
    // parse the date / time
    var parseTime = d3.timeParse('%d-%b-%y');
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(id)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + margin.left + ',' + margin.top + ')');
    // Get the data
    d3.csv(url, function(error, data) {
      if (error) throw error;
      // format the data
      data.forEach(function(d) {
          d.date = parseTime(d.date);
          d.energy = +d.energy;
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.energy; })]);

      // Add the line path.
      svg.append('path')
          .data([data])
          .attr('class', 'line')
          .attr('d', line);
      // Add the X Axis
      svg.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x));
      // Add the Y Axis
      svg.append('g')
          .call(d3.axisLeft(y));
    });
};

function drawSingleLine(dataSet, len, graph) {
    var ex = d3.extent(dataSet.values, function(d) {
        return d.energy;
    });
    x.domain(d3.extent(dataSet.values, function(d) { return d.date; }));
    y.domain([ (ex[0] - 2), (ex[1] + 2) ]);
    var localG = graph.g.append("g").attr("id", dataSet.site);
    localG.append("path")
        .datum(dataSet.values)
        .attr("fill", "none")
        .attr("stroke", graph.color(Math.random(0, len)))
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
}

function drawMultiLineGraph(url, id) {
    var graph = {};
    graph.svg = d3.select(id);
    graph.g = graph.svg.append('g').attr('transform', 'translate(' + margin.left + "," + margin.top + ")");
    graph.color = d3.scaleOrdinal(d3.schemeCategory10);
    graph.xAxis = d3.axisBottom(x);
    graph.yAxis = d3.axisLeft(y);

    d3.json("data.json", function(error, data) {
        var formattedData = formatData(data);
        var len = formattedData.length;
        formattedData.forEach(function(dataSet) {
            drawSingleLine(dataSet, len, graph);
        })

        y.domain([
            d3.min(formattedData, function(c) { return d3.min(c.values, function(v) { return v.energy; }); }),
            d3.max(formattedData, function(c) { return d3.max(c.values, function(v) { return v.energy; }); })
        ]);
        // Add the X Axis
        graph.g.append("g")     
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(graph.xAxis);

        // Add the Y axis
        graph.g.append("g")     
            .call(graph.yAxis)
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")

    });
}

drawSingleLineGraph('data/1.csv', '#chart4 svg');
drawMultiLineGraph('data.json', '#chart3 svg');

