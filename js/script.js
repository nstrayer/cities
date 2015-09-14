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
        .on("mouseover", function(d){
            console.log(d.city)
        })

})
