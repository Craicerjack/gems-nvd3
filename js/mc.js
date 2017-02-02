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
    
    function getMax(item) {
        return d3.max(item.values.map(function(d){ return d.y; }));
    }

    function getMin(item) {
        return d3.min(item.values.map(function(d){ return d.y; }));
    }

    function getEx(item) {
        return d3.extent(item.values.map(function(d){ return d.y; }));
    }

    var ex = d3.extent(data, getEx);
    console.log(ex, " - ex");
    var max = d3.max(data, getMax) + 5;
    var min = d3.min(data, getMin) -10;

    // console.log(data, " - data");
    // var getEx = data.map(function(item) {
    //     var min = d3.min(item.values).y;
    //     console.log(min, " - m");
    //     return m.y
    // });

    data[0].type = "bar";
    data[0].yAxis = 1;
    data[1].type = "bar";
    data[1].yAxis = 1;
    data[2].type = "bar";
    data[2].yAxis = 1;
    data[3].type = "bar";
    data[3].yAxis = 1;
    data[4].type = "bar";
    data[4].yAxis = 1;
    data[5].type = "bar";
    data[5].yAxis = 1;
    data[6].type = "bar";
    data[6].yAxis = 1;
    data[7].type = "bar";
    data[7].yAxis = 1;
    data[8].type = "bar";
    data[8].yAxis = 1;
    data[9].type = "bar";
    data[9].yAxis = 1;



    nv.addGraph(function() {
        var chart = nv.models.multiChart()
                        .margin({top: 30, right: 60, bottom: 50, left: 70})
                        .x(function(d) { return d.x })
                        .y(function(d) { return d.y })
                        .color(d3.scale.category10().range())
                        .yDomain1([ex[0][0] - 10, ex[1][1] + 5]);

        d3.select('#chart1 svg')
            .datum(data)
            .transition().duration(500).call(chart);

        return chart;
    });
}