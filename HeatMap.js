
const margin = { top: 100, bottom: 40, left: 150, right: 20 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Creates sources <svg> element
const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Group used to enforce margin
//reference : https://www.d3-graph-gallery.com/graph/heatmap_basic.html
//reference : http://bl.ocks.org/nbremer/62cf60e116ae821c06602793d265eaf6
const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
const cities = ["ATL", "DFW", "LAS", "LGA", "DEN"];
const map = {1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5: "May", 6:"Jun", 7:"Jul", 8:"Aug", 9:"Sept", 10:"Oct", 11:"Nov", 12:"Dec"};
d3.csv("airlines.csv")
    .then((data) => {
        var grpData = d3
            .rollups(data,
                    d =>d3.sum(d, v=>{
                        if(cities.includes(v["Airport.Code"]))
                            return v["Statistics.Flights.Delayed"];
                    }),
                    d=>{
                    if(cities.includes(d["Airport.Code"]))
                        return Number(d["Time.Month"]);
                    },
                    d=> {
                if(cities.includes(d["Airport.Code"]))
                    return d["Airport.Code"];
            });
        grpData.splice(1,1);
        var ngrpData =[];
        var maxValue = 0;
        grpData.forEach((i,idx) => {
           i[1].forEach((k,idx1) =>{
               ngrpData.push([map[i[0]], k[0], k[1]]);
               maxValue = Math.max(maxValue, k[1]);
           })
        });
        ngrpData.slice(0,1);
        console.log(maxValue);
        console.log(ngrpData);
        const xscale = d3
            .scaleBand()
            .domain(Object.values(map))
            .range([0,width])
            .padding(0.01);
        const yscale = d3
            .scaleBand()
            .domain(cities)
            .range([height, 100])
            .padding(0.01);

        const colorScale = d3.scaleLinear()
            .range(["#FFFFDD", "#1F2D86"])
            .domain([1,maxValue]);

        console.log(grpData);


        const xaxis = d3.axisBottom().scale(xscale);
        const yaxis = d3.axisLeft().scale(yscale);


        // This will take y-axis to the bottom of the page.
        g.append("g").attr("transform", `translate(0,${height})`).call(xaxis);
        g.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        g.append("g").call(yaxis);
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 80)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");

        svg.append("text")
            .attr("transform","translate(" + (width/2 + 150) + " ," + (margin.top - 50) + ")")
            .style("text-anchor", "middle")
            .text("HeatMap for Statistic.# of flight Delayed over all years")
            .style("font-size","25");

        const heatmap = g.append("g");

        const plot = heatmap
            .selectAll()
            .data(ngrpData)
            .enter()
            .append("rect")
            .attr('x', (d)=> xscale(d[0]))
            .attr('y', (d)=> yscale(d[1]))
            .attr('height', yscale.bandwidth())
            .attr('width', xscale.bandwidth())
            .attr('fill', (d)=>colorScale(d[2]));

        //legend
        var countScale = d3.scaleLinear()
            .domain([0, d3.max(ngrpData, function(d) {return d[2]; })])
            .range([0, width]);

//Calculate the variables for the temp gradient
        var numStops = 10;
        countRange = countScale.domain();
        countRange[2] = countRange[1] - countRange[0];
        countPoint = [];
        for(var i = 0; i < numStops; i++) {
            countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]);
        }

//Create the gradient
        g.append("defs")
            .append("linearGradient")
            .attr("id", "legend-traffic")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%")
            .selectAll("stop")
            .data(d3.range(numStops))
            .enter().append("stop")
            .attr("offset", function(d,i) {
                return countScale( countPoint[i] )/width;
            })
            .attr("stop-color", function(d,i) {
                return colorScale( countPoint[i] );
            });


        var legendWidth = Math.min(width*0.8, 400);
        var legendsvg = g.append("g")
            .attr("class", "legendWrapper")
            .attr("transform", "translate(" + (width/2) + "," + (40) + ")");

        legendsvg.append("rect")
            .attr("class", "legendRect")
            .attr("x", -legendWidth/2)
            .attr("y", 0)
            .attr("width", legendWidth)
            .attr("height", 10)
            .style("fill", "url(#legend-traffic)");

        legendsvg.append("text")
            .attr("class", "legendTitle")
            .attr("x", 0)
            .attr("y", -10)
            .style("text-anchor", "middle")
            .text("Number of Delays");

        var xScale = d3.scaleLinear()
            .range([-legendWidth/2, legendWidth/2])
            .domain([ 0, d3.max(ngrpData, function(d) { return d[2]; })] );

        var xAxis = d3.axisBottom()
            .ticks(5)
            .scale(xScale);

        legendsvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (10) + ")")
            .call(xAxis);


    }).catch((error) => {
    console.error("Error in loading the data");
});
