"use strict";

var showWorldMap = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var medal, color;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            medal = contents.countryMedalValue;
            color = calcColorScale(medal);


            d3.json("/topojson_file/worldTopojson.json", function (error, data) {
              if (error) throw error;
              updateMap(color, medal);
              renderLegend(color, medal);
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function showWorldMap() {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var color_na = d3.rgb("#d4d4d4");
var quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1];

var width = 960,
    height = 425;

var svg_map = d3.select("#map-container").insert("svg").attr("id", "map").attr("height", height).attr("width", width);
var path = d3.geoPath(d3.geoRobinson());

var tool_tip = d3.tip().attr("class", "d3-tip").offset([-1, 0]).html(function (d) {
  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>";
});

svg_map.call(tool_tip);

svg_map.append("g").attr("class", "legend");
svg_map.append("g").attr("class", "legend-title").append("text");

(function initMap() {

  d3.json("/topojson_file/worldTopojson.json", function (error, data) {
    if (error) throw error;

    svg_map.append("g").attr("class", "countries").selectAll("path").data(topojson.feature(data, data.objects.countries1).features).enter().append("path").attr("d", path).attr("id", function (d) {
      return d.id;
    }).call(fillMap, color_na, data).append("title").call(setPathTitle, data);
  });
})();