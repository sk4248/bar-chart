// select the svg container first
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// create margins & dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// create axes groups
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g');

//scales 
const y = d3.scaleLinear()
    .range([graphHeight, 0]);

  const x = d3.scaleBand()
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2);


  // create & call axesit
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + ' orders');

    xAxisGroup.selectAll('text')
    .attr('fill', 'orange')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')

const update = (data) => {

    //updating scale domains
    y.domain([0, d3.max(data, d => d.order)])
    x.domain(data.map(item => item.name))

    // join the data to circs
  const rects = graph.selectAll('rect')
  .data(data);
 
  //remove exit selection
  rects.exit().remove();

  //update the current shapes in the dom
  rects.attr('width', x.bandwidth)
  .attr('height', d => graphHeight - y(d.order))
  .attr('fill', 'orange')
  .attr('x', d => x(d.name))
  .attr('y', d => y(d.order));

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.order))
      .attr('fill', 'orange')
      .attr('x', (d) => x(d.name))
      .attr('y', d => y(d.order));

      xAxisGroup.call(xAxis);
      yAxisGroup.call(yAxis);
  
}

var data = [];

db.collection('dishes').onSnapshot(res => {
      res.docChanges().forEach(change => {
        const doc = {...change.doc.data(), id:change.doc.id }

        switch(change.type){
          case 'added':
            data.push(doc)
            break;
          
          case 'modified':
            const index = doc.findIndex(item => item.id == doc.id)
            data[index] = doc;
            break;

          case 'removed':
            data = data.filter(item => item.id !== doc.id);
            break;

          default:
            break;
          
        }
      })
      update(data);
})
