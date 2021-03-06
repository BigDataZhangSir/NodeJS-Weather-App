// ./weather-app/python/flask-d3/templates/js/hindcast-temp.js

//  Hindcast data passed from server:
const graphData = {{ data.hindcast_data | safe }}

// Setting dimenesions of SVG:
const margin = { top: 30, right: 50, bottom: 30, left: 50 };
const svgWidth = 1000;
const svgHeight = 600;
const figWidth = svgWidth - margin.left - margin.right;
const figHeight = svgHeight - margin.top - margin.bottom;

// Parsing date / time:
const parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;

// Setting range of data:
const x = d3.time.scale().range([0, figWidth]);
const y = d3.scale.linear().range([figHeight, 0]);

// Defining the Axes:
const xAxis = d3.svg.axis().scale(x)
      .orient('bottom').ticks(5);
const yAxis = d3.svg.axis().scale(y)
      .orient('left').ticks(5);

// Defining the data paths:
const hindcast = d3.svg.line()
.x((d) => { return x(d.date); })
.y((d) => { return y(d.temp); });

// Adding the SVG canvas:
const svg = d3.select('#graphDiv')
.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
.append('g')
  .attr('transform',
    'translate(' + margin.left + ',' + margin.top + ')');

// Defining plot function:
const plot = (data) => {
  data.forEach((d) => {
    d.date = parseDate(d.date);
    d.temp = +d.temp;
  });

  // Scaling the range of the data being plotted:
  x.domain(d3.extent(data, (d) => { return d.date; }));
  y.domain([0, 40]);

  // Adding Forecaset Temp Path:
  svg.append('path')
    .style('stroke', 'green')
    .style('fill', 'none')
    .attr('class', 'line')
    .attr('d', hindcast(data));

  // Adding X-Axis:
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + figHeight + ')')
      .call(xAxis);

  // Adding Y-Axis:
  svg.append('g')
    .attr('class', 'y axis')
      .call(yAxis);

  // Adding Text:
  svg.append('text')
    .attr('transform', 'translate(' + (figHeight - 100) + ',' + y(graphData[0].temp) + ')')
    .attr('dy', '0.15px')
    .attr('text-anchor', 'start')
    .style('fill', 'green')
    .text('Hindcast (deg.C)');

};

plot(graphData);
