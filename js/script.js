//just some nonsense to move objects to front easily.
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var width = parseInt(d3.select("#viz").style("width").slice(0, -2)),
    height = $(window).height() - 85,
    padding = 25;

var svg = d3.select("#viz").append("svg")
    .attr("height", height)
    .attr("width", width)

d3.csv("data/city_metro_pops.csv", function(data){

    //deal with numbers as strings.
    data.forEach(function(d){
        d["city_pop"]  = +d["city_pop"]
        d["metro_pop"] = +d["metro_pop"]
    })

    //get extents
    var city_limits = d3.extent(data, function(d){return d.city_pop})
    var metro_limits = d3.extent(data, function(d){return d.metro_pop})

    //setup scales.
    var city_scale = d3.scale.linear()
        .domain(city_limits)
        .range([padding, width - padding])

    var metro_scale = d3.scale.linear()
        .domain(metro_limits)
        .range([height-padding, padding])

    var dots = svg.selectAll(".cities")
        .data(data).enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d){return city_scale(d.city_pop)})
        .attr("cy", function(d){return metro_scale(d.metro_pop)})
        .attr("fill", "steelblue")
        .attr("fill-opacity", 0.7)
        .on("mouseover", function(d){
            var xPos = parseFloat(d3.select(this).attr("cx"));
            var yPos = parseFloat(d3.select(this).attr("cy"));
            drawTooltip(d, xPos, yPos)
        })
        .on("mouseout", function(){
            d3.select("#tooltip").remove()
        })

})

function drawTooltip(d, x, y){
    var right = x > width/2,
        w = 350,
        xLoc = right ? (x - w - 5) : (x + 5);

    var tip = svg.append("g") //Make a holder for the text
        .attr("id", "tooltip")
        .attr("transform", "translate(" + xLoc + ", " + (y+5) + ")") //position it over the point

    tip.append("rect")
        .attr("class", "tooltipRect")
        .attr("width", w)
        .attr("height", 50)
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("fill", "#f0f0f0")

    var name = tip.append("text") //write the snp name
        .attr("y", 20)
        .attr("x", 5)
        .style("font-size", "0px")

    name.append("tspan")
        .style("font-weight", "bold")
        .text("City: ")

    name.append("tspan")
        .text( d.city )

    name.transition().duration(250)
        .style("font-size", "14px")

    var metro = tip.append("text") //write the pvalue
        .attr("y", 40)
        .attr("x", 5)
        .style("font-size", "0px")

    metro.append("tspan")
        .style("font-weight", "bold")
        .text("Metro: ")

    metro.append("tspan")
        .text(d.metro)

    metro.transition().duration(250)
        .style("font-size", "14px")
    }
