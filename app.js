// Belly Button Biodiversity - Plotly.js
// BONUS: Build the Gauge Chart
 
// Color palette for Gauge Chart darkgreen to lightgreen
var arrColorsG = ["#e6f2e6", "#cce6cc", "#b3d9b3", "#99cc99", "#80c080", "#66b366", "#4da64d", "#339933", "#198d19", "white"];

// Use`d3.json` to fetch the metadata for a sample
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.
  
function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]
// Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
// Use `.html("") to clear any existing metadata
    panel.html("");
// Use `Object.entries` to add each key and value pair to the panel	
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Gauge Chart Function//
function buildGaugeChart(sample) {
  console.log("sample", sample);
  d3.json("data/samples.json").then(data =>{
    var objs = data.metadata;
    var matchedSampleObj = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));
    gaugeChart(matchedSampleObj[0]);
 });   
}


// Building the GAUGE Chart //
function gaugeChart(data) {
  console.log("gaugeChart", data);
  if(data.wfreq === null){
    data.wfreq = 0;
  }
  // Number of divisions in the gauge
  let degree = parseInt(data.wfreq) * (180/10);

  // Trig to calc meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);
  
  let trace = [{ type: 'scatter',
     x: [0], y:[0],
	 
      // color of circle at the center
      marker: {size: 20, color:'darkred'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:[...arrColorsG]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];
  // color of gauge's hand
  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: 'red',
        line: {
          color: 'red'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
    height: 550,
    width: 550,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});

}

// Functions to build the charts //
function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
d3.json("data/samples.json").then((data) => {
  var samples= data.samples;
  var resultsarray= samples.filter(sampleobject => 
      sampleobject.id == sample);
  var result= resultsarray[0]
  var ids = result.otu_ids;
  var labels = result.otu_labels;
  var values = result.sample_values;

// Build a BUBBLE Chart 

  var LayoutBubble = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
    };

    var DataBubble = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.newPlot("bubble", DataBubble, LayoutBubble);


//  Build a BAR Chart
  var bar_data =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"
   }
  ];

  var barLayout = {
    title: "<b>Top 10 Bacteria Cultures Found</b>",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);
});
}
// Function init to intitialize dashboard //

function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json("data/samples.json").then((data) => {
  var sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
  buildGaugeChart(firstSample)
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
buildGaugeChart(newSample)
}

// Initialize the dashboard
init();