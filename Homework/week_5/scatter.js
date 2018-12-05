var countries_dict = {
  "France": "178,24,43",
  "Germany": "239,138,98",
  "Korea": "253,219,199",
  "Netherlands": "209,229,240",
  "Portugal": "103,169,207",
  "United Kingdom": "33,102,172"
};

var svgWidth = 700;
var svgHeigth = 600;
var paddingAxes = 30;
var paddingBar = 0;
var paddingLegenda = 150;
var width = svgWidth - paddingAxes - paddingLegenda;
var height = svgHeigth - paddingAxes;

window.onload = function() {

  // source data
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015";
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015";
  var consconf = "consconf.json";
  var msti = "msti.json";
  var patents = "patents.json";

  var countries_dict = {
    "France": "178,24,43",
    "Germany": "239,138,98",
    "Korea": "253,219,199",
    "Netherlands": "209,229,240",
    "Portugal": "103,169,207",
    "United Kingdom": "33,102,172"
  };


  // waits till all requests are fullfilled
  // use it because all files are loaded asynchronously
  var requests = [d3.json(womenInScience), d3.json(consConf)];
  var requests1 = [d3.json(consconf), d3.json(msti), d3.json(patents)]
  Promise.all(requests).then(function(response) {
    var wis_data = transformResponse(response[0]);
    var consConf_data = transformResponse(response[1]);

    console.log(wis_data);
    console.log(consConf_data);
    // data_dict_dict = [ {"country":,
    //                    "time":,
    //                    "wisDP":,
    //                    "coCoDP":}]
    data_dict = {};
    data_list = [];
    // make data complete
    for (var i = 0; i < wis_data.length; i++){
      for (var j = 0; j < consConf_data.length; j++){
        if (wis_data[i].Country == consConf_data[j].Country && wis_data[i].time == consConf_data[j].time){
          if (data_dict[wis_data[i].time] == undefined){
            data_dict[wis_data[i].time] = [];
          }
          data_dict[wis_data[i].time].push([wis_data[i].Country, consConf_data[j].datapoint, wis_data[i].datapoint]);
          data_list.push([wis_data[i].time, wis_data[i].Country, consConf_data[j].datapoint, wis_data[i].datapoint]);
        }
      }
    }


    var svgWidth = 700;
    var svgHeigth = 600;
    var paddingAxes = 30;
    var paddingBar = 0;
    var paddingLegenda = 150;
    var width = svgWidth - paddingAxes - paddingLegenda;
    var height = svgHeigth - paddingAxes;

    // consumer confidence
    var xScale = d3.scaleLinear()
                   // .domain([d3.min(data_dict1, function(d) { return d[3]; }), d3.max(data_dict1[2:], function(d) { return d[3];})])
                   .domain([94, 105])
                   .range([0, height]);

    // women in science
    var yScale = d3.scaleLinear()
                       // .domain([d3.min(data_dict1, function(d) { return d[2]; }), d3.max(data_dict1[2:], function(d) { return d[2];})])
                       .domain([10, 50])
                       .range([width, 0]);



   // Color points werkt niet
    var colorScale  = d3.scaleBand()
                        .domain(["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"])
                        .range(["178,24,43", "239,138,98", "253,219,199", "209,229,240", "103,169,207", "33,102,172"])

    // createSVG(width, height);
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    console.log(Object.keys(data_dict));
    console.log(Object.values(data_dict)[0]);


    // begin screen
    function beginScreen(){
        svg.selectAll("circle")
      .data(data_list) // data_list["2007"]
      .enter()
      .append("circle")
      .attr("cx", function(d) {
       // console.log(d);
       // return d[1]
        // for (keys in data_dict){
        //   return data_dict[keys]
        // }
           return xScale(d[2]);
      })
      .attr("cy", function(d) {
         //  return d[2]
           return yScale(d[3]);
      })
      .attr("r", 10)
      .attr("fill", function(d){
        // console.log(d);
        // console.log(d[0]);
        // console.log(countries_dict[(d[0])]);
         return "rgb(" + countries_dict[(d[1])] + ")";
      });
  }
    beginScreen();

    d3.selectAll(".m")
      .on("click", function(){
        var year = this.getAttribute("value")
        console.log(year);
        if (year == "All"){
          return beginScreen();
        }
        return circle(year);
      })


    // circle / points drawn
    function circle(year) {
      svg.selectAll("circle").remove();
       svg.selectAll("circle")
       .data(Object.values(data_dict)[year]) // data_list["2007"]
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        // console.log(d);
        // return d[1]
         // for (keys in data_dict){
         //   return data_dict[keys]
         // }
            return xScale(d[1]);
       })
       .attr("cy", function(d) {
          //  return d[2]
            return yScale(d[2]);
       })
       .attr("r", 10)
       .attr("fill", function(d){
         // console.log(d);
         // console.log(d[0]);
         // console.log(countries_dict[(d[0])]);
          return "rgb(" + countries_dict[(d[0])] + ")";
       })
      }

       // AXES
      var xAxis = svg.append("g")
                     .attr("class", "y axis")
                     .attr("transform", "translate(50, 520)")
                     .call(d3.axisBottom(xScale))

      var yAxis = svg.append("g")
                     .attr("class", "y axis")
                     .attr("transform", "translate(50, 0)")
                     .call(d3.axisLeft(yScale))

      legend(svg);
  }).catch(function(e){
      console.log("doesn't load the data");
      throw(e);
  });
};


function transformResponse(data){
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

                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint

                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}
function legend(svg) {
  var legend = svg.selectAll(".legend")
    .data(Object.keys(countries_dict))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width + 20)
    .attr("y", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {
      return "rgb(" + Object.values(countries_dict)[i] + ")";
    });

  legend.append("text")
    .attr("x", width + 40)
    .attr("y", 15)
    .text(function(d) {
      return d;
    });
}
