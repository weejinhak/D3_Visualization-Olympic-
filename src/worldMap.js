const margin = {top: 50, left: 50, right: 50, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

const svg = d3.select('#map')
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const projection = d3.geo.mercator()
    .translate([width / 2, height / 2])
    .scale(120);

const path = d3.geo.path()
    .projection(projection);

const quantize = d3.scale.quantize()
    .domain([0, 1000])
    .range(d3.range(7).map(function (i) {
        return "p" + i;
    }));

const popByName = d3.map();

let year;
$("#slider").on("slide", async (event, ui) => {
    year = $('#sliderVal').text();
});

queue()
    .defer(d3.json, "/topojson_file/worldTopojson.json")
    .defer(d3.csv, "/csv_file/gdp.csv", function (d) {
        popByName.set(d.Team, +d.Y2014);
    })
    .await(ready);

function ready(error, data) {
    console.log(data)

    const countries = topojson.feature(data, data.objects.countries1).features;

    console.log(countries)

    svg.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class", function (d) {
            return "country " + quantize(popByName.get(d.properties.name) * 100);
        })
        .attr("d", path)
        .attr("id", function (d) {
            return d.properties.name;
        })
        .on('mouseover', function (d) {
            d3.select(this).classed("selected", true)
        })
        .on('mouseout', function (d) {
            d3.select(this).classed("selected", false)
        })


}

