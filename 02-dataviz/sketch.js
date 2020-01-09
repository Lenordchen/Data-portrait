const w = 250
const h = 420
const radius = 2
const perRow = 3
const groupSpacing = w / (perRow + 1)

const svg = d3.select("#wrapper").append('svg')
  .attr("width", w)
  .attr("height", h)

// setting some default forces for the simulation
// note! you can define your own force functions
// but here are some d3 defaults

// forceCenter (for setting the center of gravity of the system)
// forceManyBody (for making elements attract or repel one another)
// forceCollide (for preventing elements overlapping)
// forceX and forceY (for attracting elements to a given point)
// forceLink (for creating a fixed distance between connected elements)

const simulation = d3.forceSimulation()
  // the collide force prevents nodes from overlapping, we are naming it "collide"
  .force('collide', d3.forceCollide( d => {
    return d.r + 1 }).iterations(2)
  )
  // the charge forceManyBody force attracts each node to one another
  // Attracts (+) or repels (-) nodes to/from each other
  // The default value is -30, change it with strength() chained after it
  .force('charge', d3.forceManyBody().strength(-2))
  // manually set the x and y forces to the center of the svg
  .force('y', d3.forceY().y(h / 2))
  .force('x', d3.forceX().x(w / 2))

d3.json('ks-projects-2016novlastweek.csv').then( data => {
  // we want to add a radius and x and y positions to each of our nodes
  data.forEach(d => {
    d.r = radius
    d.x = w / 2
    d.y = h / 2
  })
  console.log(data)

  // let's prototype with less data
  const filteredData = data.slice(0, data.length/2)

  const colorScale = d3.scaleSequential(d3.interpolatePlasma)
    .domain(d3.extent(data, d => +d.goal))

  console.log(colorScale)

  let circles = svg.selectAll('circle')
    .data(filteredData)




  let circlesEnter = circles.enter().append("circle")
    .attr("r", d => {
      return d.r
    })
    // .style("fill", d => colorScale(+d.goal))
    .style("fill", d => '#fa8407')
    .style("pointer-events", "all")

    console.log(circlesEnter)
    // .call(d3.drag()
    //         .on("start", dragstarted)
    //         .on("drag", dragged)
    //         .on("end", dragended));

  circles = circles.merge(circlesEnter)

  function ticked() {
    //console.log("tick")
    circles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
  }

  simulation
    .nodes(filteredData)
    .on("tick", ticked)

  function updateNodeGroups(data, byVar) {

    const varValues = data.reduce((obj, d, i) => {
      // here we want to group elements according to the values they
      // have in common for a particular key (that we select by the button)
      if (obj[d[byVar]]){
        obj[d[byVar]]++;
      } else {
        obj[d[byVar]] = 1;
      }

      return obj

      console.log(d[byVar])
    }, {})

    console.log(varValues)


    // now we want to create a data structure where all the elements in
    // the same group have the same x,y coordinates as their force target
    const varPosObj = Object.keys(varValues).reduce( (obj, val, i) => {
      console.log(i, val)
      if (byVar === 'all') {
        obj[val] = {
          'x': w/2,
          'y': h/2
        }
      } else {
        // this gives each group a different x,y target based on the
        // amount of groups and the row column spacing (like making a grid)
        obj[val] = {
          'x': (i % perRow + 1) * groupSpacing,
          'y': (Math.floor(i / perRow) + 1) * groupSpacing
        }
      }
      return obj
    }, {})

    console.log(varPosObj)

    if(byVar === 'all'){
      hideTitles()
    } else {
      showTitles(byVar, varValues)

    }

    console.log(byVar);
    console.log(varValues);

    // Reset the 'x' force to draw the bubbles to their new centers
    // based on how many subgroups there are
    simulation.force('x', d3.forceX().strength(0.1).x( (d, i) => {
      return varPosObj[d[byVar]].x
    }))


    simulation.force('y', d3.forceY().strength(0.1).y( (d, i) => {
      return varPosObj[d[byVar]].y
      //console.log(varPosObj[d[byVar]].y);
    }))

    // Reset the alpha value and restart the simulation
    simulation.alpha(1).restart()
    // .alphaDecay(0.0001).restart()
  }

  function showTitles(byVar, varVals) {
    // let's draw the value groups above the group of circles
    var titles = svg.selectAll('.title')
      .data(Object.keys(varVals));
    console.log(Object.keys(varVals))
    console.log(Object.values(varVals).length)

    titles.enter().append('text')
        .attr('class', 'title')
        .merge(titles)
        .attr('x', (d, i) => {
          return (i % perRow + 0.9) * groupSpacing
        })
        .attr('y', (d, i) => {
          return (Math.floor(i / perRow) + 0.85) * groupSpacing * 1.3
        })
        .attr('text-anchor', 'middle')
        .style('font-weight', '500')
        .style('fill', '#282828')

        .text( d => d.charAt(0).toUpperCase() + d.slice(1))

    titles.exit().remove()
    console.log(titles);
    console.log(varVals);
  }


  function hideTitles() {
    svg.selectAll('.title').remove()
  }

  function setupButtons() {
    d3.selectAll('.button')
      .on('click', function() {
        // Remove active class from all buttons
        d3.selectAll('.button').classed('active', false)
        // Find the button just clicked
        var button = d3.select(this)

        // Set it as the active button
        button.classed('active', true)

        // Get the id of the button
        var buttonId = button.attr('id')

        console.log(buttonId)
        // Toggle the bubble chart based on
        // the currently clicked button.
        updateNodeGroups(filteredData, buttonId)
      })
  }

setupButtons()
})
