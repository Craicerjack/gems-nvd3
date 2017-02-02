d3.json("/data.json", function(data) {
    formatData(data);
});

function formatData(data) {
    var formattedData = [];
    var recs = data.records;
    var formattedRecs = recs.map(function(val, idx, arr) {

        var isIt = formattedData.findIndex(function(item){ return item.key === val.site });
        if (isIt > -1) {
            formattedData[isIt].values.push({ key: val.site, y: val.energy, x: new Date(val.date).getFullYear() });
        } else {
            formattedData.push({
                key: val.site,
                values: [{ key: val.site, y: val.energy, x: new Date(val.date).getFullYear() }]
            });
        }
    });
    run(formattedData);
}

function run(data) {
    console.log(data, " - data");
    function getEx(item) {
        // Takes an object with an array of objects and returns the max and mins for that object
        return d3.extent(item.values.map(function(d){ return d.y; }));
    }

    // ex becomes an array of arrays, ex[0] is an array with the min object
    // ex[1] is an array with the max object so to use for our domain min = ex[0][0] and max=ex[1][1]
    var ex = d3.extent(data, getEx);

    data.forEach(function(item) {
        item.type = "bar";
        item.yAxis = 1;
    });

    nv.addGraph(function() {
        var chart = nv.models.multiChart()
                        .margin({top: 30, right: 60, bottom: 50, left: 70})
                        .color(d3.scale.category10().range())
                        .yDomain1([ (ex[0][0] - 10), (ex[1][1] + 5) ]);


        d3.select('#chart1 svg').datum(data).transition().duration(500).call(chart);
        return chart;
    });
}