"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var color_na = d3.rgb("#d4d4d4");
var quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1];
var init_year = 1960;
var year = 1960;

var width = 960,
    height = 425;
var svg_map = d3.select("#map-container").insert("svg").attr("id", "map").attr("height", height).attr("width", width);
var path = d3.geoPath(d3.geoRobinson());

svg_map.append("g").attr("class", "legend");
svg_map.append("g").attr("class", "legend-title").append("text");

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var _this = this;

  var Data, data_all, data, color;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return variableDataLoader.getVariableDataList("life_expectancy");

        case 2:
          Data = _context2.sent;
          data_all = Data['Root'];
          data = data_all[year];

          console.log(data);
          color = calcColorScale(data);


          d3.json("/topojson_file/worldTopojson.json", function (error, data) {
            if (error) throw error;

            // init map
            svg_map.append("g").attr("class", "countries").selectAll("path").data(topojson.feature(data, data.objects.countries1).features).enter().append("path").attr("d", path).attr("id", function (d) {
              return d.id;
            }).call(fillMap, color, data).append("title").call(setPathTitle, data);

            renderLegend(color, data);
          }); // map data

          $("#slider").on("slide", function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, ui) {
              var upd_color;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      year = $('#slider-value').text();
                      upd_color = calcColorScale(data_all[year]);

                      updateMap(upd_color, data_all[year]);
                      renderLegend(upd_color, data_all[year]);

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            }));

            return function (_x, _x2) {
              return _ref2.apply(this, arguments);
            };
          }());

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
}))();