// Reference - https://github.com/sgratzl/d3tutorial/blob/master/examples/persons.html
const margin = { top: 100, bottom: 30, left: 150, right: 20 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

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

        var maxValue, minValue;
        maxValue = d3.max(data, d=>d["Statistics.Flights.Cancelled"]);
        minValue = d3.min(data, d=>d["Statistics.Flights.Cancelled"]);
        const xscale = d3
            .scaleLinear()
            .domain([0,maxValue])
            .range([0,width]);

        const xaxis = d3.axisBottom().scale(xscale);

        g.append("g").attr("transform", `translate(0,${height})`).call(xaxis);
        g.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Flights");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 100)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Count");

        svg.append("text")
            .attr("transform","translate(" + (width/2 + 150) + " ," + (margin.top - 50) + ")")
            .style("text-anchor", "middle")
            .text("Statistic.# of Flights Cancelled")
            .style("font-size","25");


        var histogram = d3.histogram()
            .value(function(d) { return d["Statistics.Flights.Cancelled"]; })
            .domain(xscale.domain())
            .thresholds(xscale.ticks(40));

            var bins = histogram(data);

            var yscale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(bins, function(d) { return d.length;})]);
            g.append("g")
                .call(d3.axisLeft().scale(yscale));
                console.log(bins);
            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("x", 150)
                .attr("y", 100)
                .attr("transform", function(d) { return "translate(" + xscale(d.x0) + "," + yscale(d.length) + ")"; })
                .attr("width", function(d) { return xscale(d.x1) - xscale(d.x0) -1 ; })
                .attr("height", function(d) { return height - yscale(d.length); })
                .style("fill", "steelblue")




    }).catch((error) => {
    console.error("Error in loading the data");
});
