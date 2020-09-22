// Reference - https://github.com/sgratzl/d3tutorial/blob/master/examples/persons.html
const margin = { top: 100, bottom: 40, left: 150, right: 20 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element
const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Group used to enforce margin
const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("airlines.csv")
    .then((data) => {
        var grpData = d3
            .rollups(data, d => d3.sum(d, v=>v["Statistics.# of Delays.Security"]), d=>d["Time.Year"]);
        const xscale = d3
            .scaleBand()
            .domain(data.map((d) => d["Time.Year"]))
            .range([0,width])
            .padding(0.4);
        const yscale = d3
            .scaleLinear()
            .domain([0,  d3.max(grpData, d => d[1])])
            .range([height, 0]);

        const colorScale = d3.interpolateBlues(0.7);

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
            .text("Statistic.# of delays per year")
            .style("font-size","25");

        const chart = g.append("g");

        const bar = chart
            .selectAll()
            .data(grpData)
            .enter()
            .append("rect")
            .attr('x', (d)=> xscale(d[0]))
            .attr('y', (d)=> yscale(d[1]))
            .attr('height', (d) => height - yscale(d[1]))
            .attr('width', xscale.bandwidth())
            .attr('fill', colorScale);




    }).catch((error) => {
    console.error("Error in loading the data");
});
