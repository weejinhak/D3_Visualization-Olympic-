let hostCountry = null;
let prevHostCountry = null;

function fillMap(selection, color, data) {

  selection
    .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? color_init :
                                              d3.rgb(color(data[d.id])); });

    $('path').hover(function () {
        console.log('path ' , this);

        $('.modal').css('display','block');

        const px = $(this).offset().left;
        const py = $(this).offset().top;

        $('.modal').offset({left:px , top:py});

        $('.modal').mouseleave(function () {
           $('.modal').css('display','none');
        });

    },function () {

    });
}

function setPathTitle(selection, data) {
    selection
    .text(function(d) { return "" + d.id + ", " + (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
}

function updateMap(color, data) {

  // fill paths
  d3.selectAll("svg#map path").transition()
    .delay(100)
    .call(fillMap, color, data);

  // update path titles
  d3.selectAll("svg#map path title")
    .call(setPathTitle, data);

  d3.select(`#${prevHostCountry}`)
    .attr("style", null);

  hostCountry = contents.hostCountry;

  d3.select(`#${hostCountry}`)
      .style("opacity", 1)
      .style("stroke","black")
      .style("stroke-width",2);

  prevHostCountry = hostCountry;

}

function renderLegend(color, data) {

  let svg_height = +d3.select("svg#map").attr("height");
  let legend_items = pairQuantiles(color.domain());

  let legend = d3.select("svg#map g.legend").selectAll("rect")
               .data(color.range());

  legend.exit().remove();

  legend.enter()
          .append("rect")
          .merge(legend)
          .attr("width", "20")
          .attr("height", "20")
          .attr("y", function(d, i) { return (svg_height-29) - 25*i; })
          .attr("x", 30)
          .attr("fill", function(d, i) { return d3.rgb(d); })
          .on("mouseover", function(d) { legendMouseOver(d, color, data); })
          .on("mouseout", function() { legendMouseOut(color, data); });

  let text = d3.select("svg#map g.legend").selectAll("text");

  text.data(legend_items)
    .enter().append("text").merge(text)
      .attr("y", function(d, i) { return (svg_height-14) - 25*i; })
      .attr("x", 60)
      .text(function(d, i) { return d; });

  d3.select("svg#map g.legend-title text")
        .text("Legend (quintile ranges)")
        .attr("x", 30)
        .attr("y", 286);
}

function calcColorScale(data) {

  // get values and sort
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  let quantiles_calc = quantiles.map( function(elem) {
                  return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
              .domain(quantiles_calc)
              .range(d3.schemeReds[(quantiles_calc.length)-1]);

  return scale;
}


function legendMouseOver(color_key, color, data) {

  d3.selectAll("svg#map path").interrupt();


  d3.selectAll("svg#map path")
    .call(fillMap, color, data);

  d3.selectAll("svg#map path:not([fill = '"+ d3.rgb(color_key) +"'])")
      .attr("fill", color_init);
}

function legendMouseOut(color, data) {

  d3.selectAll("svg#map path").transition()
    .delay(100)
    .call(fillMap, color, data);
}


function pairQuantiles(arr) {

  let new_arr = [];
  for (let i=0; i<arr.length-1; i++) {

    if(i === arr.length-2) {
      new_arr.push([arr[i],  arr[i+1]]);
    }
    else {
      new_arr.push([arr[i], arr[i+1]-1]);
    }
  }

  new_arr = new_arr.map(function(elem) { return elem[0] === elem[1] ?
    d3.format(",")(elem[0]) :
    d3.format(",")(elem[0]) + " - " + d3.format(",")(elem[1]);
  });

  return new_arr;
}