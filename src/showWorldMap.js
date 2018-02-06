const color_na = d3.rgb("#d4d4d4");
const quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1];

const width = 960, height = 425;


const svg_map = d3.select("#map-container").insert("svg")
  .attr("id", "map")
  .attr("height", height)
  .attr("width", width);
const path = d3.geoPath(d3.geoRobinson());


var tool_tip = d3.tip()
.attr("class", "d3-tip")
.offset([-1, 0])
.html(function(d) {return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>";});

svg_map.call(tool_tip);

svg_map.append("g")
  .attr("class", "legend");
svg_map.append("g")
  .attr("class", "legend-title")
  .append("text");
  
(function initMap() {

  d3.json("/topojson_file/worldTopojson.json", function (error, data) {
    if (error) throw error;

    svg_map.append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(topojson.feature(data, data.objects.countries1).features)
      .enter().append("path")
      .attr("d", path)
      .attr("id", function (d) { return d.id; })
      .call(fillMap, color_na, data)
      .append("title")
      .call(setPathTitle, data);

  });



})();


async function showWorldMap() {

  let medal = contents.countryMedalValue;
  let color = calcColorScale(medal);

  d3.json("/topojson_file/worldTopojson.json", function (error, data) {
    if (error) throw error;
    updateMap(color, medal);
    renderLegend(color, medal);
  });

}