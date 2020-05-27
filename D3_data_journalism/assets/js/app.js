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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(jourData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(jourData, d => d[chosenXAxis]) * 0.8,
      d3.max(jourData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, sctWidth]);

  return xLinearScale;

}


// function used for updating y-scale var upon click on axis label
function yScale(jourData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(jourData, d => d[chosenYAxis]) * 0.8,
        d3.max(jourData, d => d[chosenYAxis]) * 1.2
      ])
      .range([sctHeight,0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating xAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(LeftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis,newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function used for updating state labels with a transition to
// new state
function renderText(textGroup, newXScale, chosenXAxis,newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return textGroup;
  }

 //function for unit for chosen values showed on tooltipa
function xUnits(unit, xData) {
    if (xData==='poverty'){
        return '${value}%';
    }
    else if (xData==='income'){
        return '$${value}';
    }
    else {
        return '${value}';
    }
}



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenXAxis,circlesGroup) {
    // x Lable
  var xLabel;

  if (chosenXAxis === "poverty") {
    xLabel = "Poverty:";
  }
  else if (chosenXAxis === "income") {
    xLabel = "Median Income:";
  }
  else {
    xLabel = "Age:";
  }
  //y Label
  var yLabel;

  if (chosenXAxis === "healthcare") {
    yLabel = "No Healthcare:";
  }
  else if (chosenXAxis === "obesity") {
    yLabel = "Obesity:";
  }
  else {
    yLabel = "Smokers:";
  }
 

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${xUnits(d[chosenXAxis],chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover",toolTip.show)
    // onmouseout event
    .on("mouseout",toolTip.hide);

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(jourData, err) {
  if (err) throw err;

  // parse data
  jourData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare= +data.healthcare;
    data.obesity= +data.obesity;
    data.smokes= +data.smokes;
   
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(jourData, chosenXAxis);
  var yLinearScale = yScale(jourData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${sctHeight})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(jourData)
    .enter()
    .append("circle")
    .classed("stateCircle",true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("opacity", ".5");

  // append initial text
  var textGroup = chartGroup.selectAll(".stateText")
    .data(jourData)
    .enter()
    .append("text")
    .classed("stateText",true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", 3)
    .attr("font-size", "10px")
    .text(function(d){return d.abbr});

  // Create group for 3 x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${sctWidth / 2}, ${sctHeight + 20 +margin.top})`);

  var povertyLabel = xLabelsGroup.append("text")
    .classed("aText",true)
    .classed("active",true)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .classed("aText",true)
    .classed("inactive",true)
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .classed("aText",true)
    .classed("inactive",true)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .text("Household Income (Median)");

// Create group for 3 y-axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${0 - margin.left/4}, ${(sctHeight/2)})`);

  var healthcareLabel = yLabelsGroup.append("text")
    .classed("aText",true)
    .classed("active",true)
    .attr("x", 0)
    .attr("y",0 - 20)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "healthcare") // value to grab for event listener
    .text("Lacks Healthcare (%)");

  var obesityLabel = yLabelsGroup.append("text")
    .classed("aText",true)
    .classed("inactive",true)
    .attr("x", 0)
    .attr("y",0 - 40)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes") // value to grab for event listener
    .text("Smokes (%)");

  var obesityLabel = yLabelsGroup.append("text")
    .classed("aText",true)
    .classed("inactive",true)
    .attr("x", 0)
    .attr("y",0 - 60)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "obesity") // value to grab for event listener
    .text("Obese (%)");
   // updateToolTip function above csv import
   var circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(jourData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        // updates text with new x values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis==="age"){
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
      }
    });

    // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenYAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(jourData, chosenYAxis);

      // updates x axis with transition
      yAxis = renderAxesY(yLinearScale, yAxis);

      // updates circles with new  values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
      // updates text with new  values
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis==="smokes"){
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
  });




}).catch(function(error) {
  console.log(error);
});


