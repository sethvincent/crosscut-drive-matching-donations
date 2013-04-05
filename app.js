$(document).ready(function(){

  var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0AuwSoq4skLXjdGVMWVlrN1Y0elFkYkh1R2xlcDNmd1E&output=html';

  Tabletop.init({ 
    key: public_spreadsheet_url,
    callback: thermometer,
    simpleSheet: true 
  });

  function thermometer(response, tabletop) {
    $(".loading").hide();
    $("#thermometer").show();
    var data = response[0];
    console.log(data)
    var percentage = ((data.current / data.goal)*100).toFixed(0);
    var remaining = data.goal - data.current;

    $(".headline").text(data.headline);
    $("title").text(data.headline);
    $("meta[name=description]").text(data.description);
    $(".description").html(data.description);
    $(".percentage").text(percentage + '%');
    $(".goal").text(data.goal);
    $(".current").text(data.current);
    $(".donations").text(data.current * 200);
    // todo: create an object up front that calls parseInt on numbers 
    // and creates attributes on the object
    if ( parseInt(data.current) < parseInt(data.goal) ){
      $(".remaining").text(remaining);
    } else {
      $(".please-join").html("We've reached our goal, but you can still join!")
    }
    
    $(".action").attr("href", data.link).attr("alt", data.headline);
    
    var chartSize = data.goal * 5;
    var current = data.current * 5;

    var chart = d3.select(".graph").append("svg")
      .attr("width", 80)
      .attr("height", chartSize);

    var y = d3.scale.linear()
      .domain([0, data.goal])
      .range([chartSize, 0]);

    var x = d3.scale.ordinal()
      .domain(data.goal)
      .rangeBands([0, data.goal]);

    var color = d3.scale.linear()
      .domain([0, chartSize])
      .range(["red", "green"]);

    var outline = chart.selectAll("rect")
      .data([data.current])
    .enter().append("rect")
      .attr("x", 30)
      .attr("y", 0)
      .attr("width", 50)
      .attr("height", chartSize)
      .style("stroke", "#e9e9e9")
      .style("fill", "rgba(255, 255, 255, 0)");

    outline.select("rect")
      .data([data.current])
    .enter().append("rect")
      .attr("x", 30)
      .attr("y", function() { return chartSize - current; })
      .attr("width", 50)
      .attr("height", function() { return current; })
      .style("fill", "#FF4405");

    chart.selectAll("line")
      .data(y.ticks(18))
    .enter()
      .append("line")
      .attr("x1", 30)
      .attr("x2", 40)
      .attr("y1", y)
      .attr("y2", y)
      .style("stroke", "#e9e9e9");

    chart.selectAll(".rule")
      .data(y.ticks(10))
    .enter().append("text")
      .attr("class", "rule")
      .attr("x", 25)
      .attr("y", y)
      .attr("height", 0)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "#42D0FF")
      .text(String);

  }

});