"use strict";

var hostCountry = null;
var prevHostCountry = null;

function fillMap(selection, color, data) {

  // TODO: minor fix, sometimes d gets a -99, why?
  selection.attr("fill", function (d) {
    return typeof data[d.id] === 'undefined' ? color_na : d3.rgb(color(data[d.id]));
  });
}

function setPathTitle(selection, data) {
  selection.text(function (d) {
    return "" + d.id + ", " + (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]);
  });
}

function updateMap(color, data) {

  // fill paths
  d3.selectAll("svg#map path").transition().delay(100).call(fillMap, color, data);

  // update path titles
  d3.selectAll("svg#map path title").call(setPathTitle, data);

  d3.select("#" + prevHostCountry).attr("style", null);

  hostCountry = contents.hostCountry;

  d3.select("#" + hostCountry).style("opacity", 1).style("stroke", "black").style("stroke-width", 2);

  prevHostCountry = hostCountry;
}

function renderLegend(color, data) {

  var svg_height = +d3.select("svg#map").attr("height");
  var legend_items = pairQuantiles(color.domain());

  var legend = d3.select("svg#map g.legend").selectAll("rect").data(color.range());

  legend.exit().remove();

  legend.enter().append("rect").merge(legend).attr("width", "20").attr("height", "20").attr("y", function (d, i) {
    return svg_height - 29 - 25 * i;
  }).attr("x", 30).attr("fill", function (d, i) {
    return d3.rgb(d);
  }).on("mouseover", function (d) {
    legendMouseOver(d, color, data);
  }).on("mouseout", function () {
    legendMouseOut(color, data);
  });

  var text = d3.select("svg#map g.legend").selectAll("text");

  text.data(legend_items).enter().append("text").merge(text).attr("y", function (d, i) {
    return svg_height - 14 - 25 * i;
  }).attr("x", 60).text(function (d, i) {
    return d;
  });

  d3.select("svg#map g.legend-title text").text("Legend (quintile ranges)").attr("x", 30).attr("y", 286);
}

function calcColorScale(data) {
  // TODO: minor, check how many data poins we've got
  // with few datapoints the resulting legend gets confusing

  // get values and sort
  var data_values = Object.values(data).sort(function (a, b) {
    return a - b;
  });

  var quantiles_calc = quantiles.map(function (elem) {
    return Math.ceil(d3.quantile(data_values, elem));
  });

  var scale = d3.scaleQuantile().domain(quantiles_calc).range(d3.schemeReds[quantiles_calc.length - 1]);

  return scale;
}

/// event handlers /////

function legendMouseOver(color_key, color, data) {

  // cancels ongoing transitions (e.g., for quick mouseovers)
  d3.selectAll("svg#map path").interrupt();

  // TODO: improve, only colored paths need to be filled

  // then we also need to refill the map
  d3.selectAll("svg#map path").call(fillMap, color, data);

  // and fade all other regions
  d3.selectAll("svg#map path:not([fill = '" + d3.rgb(color_key) + "'])").attr("fill", color_na);
}

function legendMouseOut(color, data) {

  // TODO: minor, only 'colored' paths need to be refilled
  // refill entire map
  d3.selectAll("svg#map path").transition().delay(100).call(fillMap, color, data);
}

// pairs neighboring elements in array of quantile bins
function pairQuantiles(arr) {

  var new_arr = [];
  for (var i = 0; i < arr.length - 1; i++) {

    // allow for closed intervals (depends on d3.scaleQuantile)
    // assumes that neighboring elements are equal
    if (i == arr.length - 2) {
      new_arr.push([arr[i], arr[i + 1]]);
    } else {
      new_arr.push([arr[i], arr[i + 1] - 1]);
    }
  }

  new_arr = new_arr.map(function (elem) {
    return elem[0] === elem[1] ? d3.format(",")(elem[0]) : d3.format(",")(elem[0]) + " - " + d3.format(",")(elem[1]);
  });

  return new_arr;
}