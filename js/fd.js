function formatData(data) {
    var formattedData = [];
    var recs = data.records;
    var formattedRecs = recs.map(function(val, idx, arr) {
        var isIt = formattedData.findIndex(function(item){ return item.key === val.site });
        if (isIt > -1) {
            formattedData[isIt].values.push({ "energy": val.energy, "date": new Date(val.date).getFullYear() });
        } else {
            formattedData.push({
                key: val.site,
                values: [{ "energy": val.energy, date: new Date(val.date).getFullYear() }]
            });
        }
    });
    return formattedData;
}