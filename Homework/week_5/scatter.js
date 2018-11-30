window.onload = function() {
  console.log('Yes, you can!')

  // source data
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  // waits till all requests are fullfilled
  // use it because all files are loaded asynchronously
  var requests = [d3.json(womenInScience), d3.json(consConf)];
  Promise.all(requests).then(function(response) {
    //  doFunction(response);
    console.log("bla1");
    console.log(requests[0]);
  }).catch(function(e){
      throw(e);
  });
  console.log("bla2");
};
console.log(requests[0]);
