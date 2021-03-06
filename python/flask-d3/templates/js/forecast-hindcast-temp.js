// Loading data passed from flask server:
const graphData = {{ data.temp_data | safe }}

// Set dimensions of SVG object:
const margin = { top: 30, right: 50, bottom: 30, left: 50 };
const svgWidth = 1000;
const svgHeight = 600;

// Center the D3-figure wihin the SVG element
const figWidth = svgWidth - margin.left - margin.right;
const figHeight = svgHeight - margin.top - margin.bottom;

// Parsing the datetime column:
const parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;

// Setting the figures' axes ranges:
const x = d3.time.scale().range([0, figWidth]);
const y = d3.scale.linear().range([figHeight, 0]);

// Defining the axes:
const xAxis = d3.svg.axis().scale(x)
      .orient('bottom').ticks(5);
const yAxis = d3.svg.axis().scale(y)
      .orient('left').ticks(5);

// Defining the Forecast temperature data:
const forecastLine = d3.svg.line()
    .defined((d) => { return d.forecast; })
      .x((d) => { return x(d.date); })
      .y((d) => { return y(d.forecast); });

// Defining the historical Hindcast temperature data:
const hindcastLine = d3.svg.line()
    .defined((d) => { return d.hindcast; })
      .x((d) => { return x(d.date); })
      .y((d) => { return y(d.hindcast); })

// Adding the SVG canvas:
const svg = d3.select('#graphDiv')
      .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Defining plot/draw function:
const plot = (data) => {
  data.forEach((d) => {
    d.date = parseDate(d.date);
    d.forecast = +d.forecast;
    d.hindcast = +d.hindcast;
  });

  // Scale the data's range:
  x.domain(d3.extent(data, (d) => { return d.date; }));
  y.domain([0, 20]);

  // Adding the X-Axis:
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + figHeight + ')')
      .call(xAxis);

  // Adding the Y-Axis:
  svg.append('g')
    .attr('class', 'y axis')
      .call(yAxis);

  // Adding forecast & hindcast temperature data:
  // a. Forecast data:
  svg.append('path')
    .style('stroke', 'green')
    .style('fill', 'none')
    .attr('class', 'line')
    .attr('d', forecastLine(data));

  // b. Hindcast (historical) data:
  svg.append('path')
    .style('stroke', 'steelblue')
    .style('fill', 'none')
    .style('stroke-dasharray', ('3, 3'))
    .attr('d', hindcastLine(data));

};

plot(graphData)
