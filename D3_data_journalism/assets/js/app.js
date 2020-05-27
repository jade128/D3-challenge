// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 100
};

var sctWidth = svgWidth - margin.left - margin.right;
var sctHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3.select("#scatter").append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(jourData, err) {
    if (err) throw err;

    jourData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity= +data.obesity;
      });


  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(jourData, d => d.poverty) * 0.8,
      d3.max(jourData, d => d.poverty) * 1.2
    ])
    .range([0, sctWidth]);

  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(jourData, d => d.obesity) * 0.8,
        d3.max(jourData, d => d.obesity) * 1.2
      ])
      .range([sctHeight,0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to the chart group 
  // Bottom axis moves using sctheight 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${sctHeight})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);


  // Create Circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(jourData)
    .enter()
    .append("circle")
    .classed("stateCircle",true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 12)
    .attr("opacity", ".75");

  // Append text to circles 
  var textGroup = chartGroup.selectAll(".stateText")
    .data(jourData)
    .enter()
    .append("text")
    .classed("stateText",true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .attr("dy", 5)
    .attr("font-size", "10px")
    .text(d => (d.abbr));


  // Create tooltip in the chart
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover",toolTip.show)
    .on("mouseout",toolTip.hide);


  // Create label group for x-axis labels
  var xLabels= chartGroup.append("g")
    .attr("transform", `translate(${sctWidth / 2}, ${sctHeight + 20 +margin.top})`)
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("value", "poverty") // value to grab for event listener
    .text("In Poverty (%)");

// Create label for y-axis labels
  var yLabels = chartGroup.append("g")
    .attr("transform", `translate(${0 - margin.left/4}, ${(sctHeight/2)})`)
    .append("text")
    .attr("x", 0)
    .attr("y",0-20)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "obesity") // value to grab for event listener
    .text("Obese (%)");


});