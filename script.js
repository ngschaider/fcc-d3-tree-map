const width = 1300;
const height = 1300;

const DATA_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const marginBottom = 400;

const tooltip = d3.select("#tooltip");

const svg = d3.select("#root").append("svg")
  .attr("width", width)
  .attr("height", height);

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

d3.json(DATA_URL).then(data => {
  var root = d3.hierarchy(data).sum(d => d.value).sort((a,b) => b.value - a.value);
  
  d3.treemap()
    .size([width, height - marginBottom])
    .padding(1)
    (root)
  
  svg.selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-value", d => d.data.value)
    .attr("data-category", d => d.data.category)
    .on("mouseover", mouseover(root.leaves()))
    .on("mouseout", mouseout(root.leaves()))
    .style("fill", d => colorScale(d.data.category));

  svg.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", d => d.x0 + 5)    // +10 to adjust position (more right)
    .attr("y", d => d.y0 + 20)    // +20 to adjust position (lower)
    .html(d => d.data.name.split(" ").join("\n"))
    .attr("font-family", "Calibri")
    .attr("font-size", "14px");
  
  var addedCategories = [];
  
  var legend = svg.append("g")
    .attr("id", "legend");
  
  var categories = root.leaves().map(d => d.data.category);
  categories = categories.filter((d, i) => {
    return categories.indexOf(d) === i;
  })
  
  legend.selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", 20)
    .attr("y", (d, i) => (height - marginBottom + 20 + i * 20) + "px")
    .attr("fill", d => colorScale(d));
  
  legend.selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", (d, i) => (height - marginBottom + 30 + i * 20) + "px")
    .attr("font-size", "12px")
    .text(d => d);
});


function mouseover(nodes) {
  return function(e) {
    var node = d3.select(this);
    
    tooltip
      .style("left", (e.pageX + 80) + "px")
      .style("top", (e.pageY - 25) + "px")
      .html(node.attr("data-name") + "<br>" + node.attr("data-category") + "<br>" + node.attr("data-value"))
      .attr("data-value", node.attr("data-value"))
      .transition()
      .duration(100)
      .style("opacity", 0.9);
  };
}

function mouseout(nodes) {
  return function(e) {
    tooltip.transition().duration(100).style("opacity", 0);
  };
}