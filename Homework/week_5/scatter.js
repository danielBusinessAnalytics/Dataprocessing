window.onload = function() {

  // source data
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var consconf = "consconf.json"
  var msti = "msti.json"
  var patents = "patents.json"

  // waits till all requests are fullfilled
  // use it because all files are loaded asynchronously
  var requests = [d3.json(womenInScience), d3.json(consConf)];
  var requests1 = [d3.json(consconf), d3.json(msti), d3.json(patents)]
  Promise.all(requests).then(function(response) {
    //  doFunction(response);
    var wis_data = transformResponse(response[0]);
    var consConf_data = transformResponse(response[1]);
    console.log(wis_data);
    console.log(consConf_data);


    var data_dict = {}
    for (var i = 0; i < wis_data.length; i++){
      for (var j = 0; j < consConf_data.length; j++){
        if (wis_data[i].country == consConf_data[j].Country && wis_data[i].time == consConf_data[j].time){
          console.log("bla");
          if (data_dict[wis_data[i].time] == undefined){
            data_dict[wis_data[i].time] = []
            data_dict[wis_data[i].time].push([wis_data[i].country, wis_data[i].datapoint, consConf_data[j].datapoint])
          } else {
            data_dict[wis_data[i].time].push([wis_data[i].country, wis_data[i].datapoint, consConf_data[j].datapoint]);
          }
        }
      }
    }
    console.log(data_dict);


  }).catch(function(e){
      console.log("doesn't load the data");
      throw(e);
  });
};








function transformResponse(data){
    t = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint

                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                tempObj["country"] = t.structure.dimensions.series[1].values[Number(string.slice(-1))].name;
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}
