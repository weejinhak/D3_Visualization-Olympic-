"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

var svg = d3.select('#map').append("svg").attr("height", height + margin.top + margin.bottom).attr("width", width + margin.left + margin.right).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var projection = d3.geo.mercator().translate([width / 2, height / 2]).scale(120);

var path = d3.geo.path().projection(projection);

var quantize = d3.scale.quantize().domain([0, 1000]).range(d3.range(7).map(function (i) {
    return "p" + i;
}));

var popByName = d3.map();

var year = void 0;
$("#slider").on("slide", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, ui) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        year = $('#sliderVal').text();

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

queue().defer(d3.json, "/topojson_file/worldTopojson.json").defer(d3.csv, "/csv_file/gdp.csv", function (d) {
    popByName.set(d.Team, +d.Y2014);
}).await(ready);

function ready(error, data) {
    console.log(data);

    var countries = topojson.feature(data, data.objects.countries1).features;

    console.log(countries);

    svg.selectAll("path").data(countries).enter().append("path").attr("class", function (d) {
        return "country " + quantize(popByName.get(d.properties.name) * 100);
    }).attr("d", path).attr("id", function (d) {
        return d.properties.name;
    }).on('mouseover', function (d) {
        d3.select(this).classed("selected", true);
    }).on('mouseout', function (d) {
        d3.select(this).classed("selected", false);
    });
}