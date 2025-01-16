// Constants
const svg = d3.select('svg')
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 50, right: 0, bottom: 20, left: 20 };
const inner_width = width - margin.left - margin.right;
const inner_height = height - margin.top - margin.bottom;
const button_width = 300;
const button_height = 50;
const button_margin = 10;
const button_data = [
    { label: 'Introduction', x: 0, y: 0, link: '../introduction/main.html' },
    { label: 'Top 10 Data Science Jobs', x: button_width + button_margin, y: 0, link: '../top_10_data_science_jobs/main.html' },
];
// Modify the following constants for different pages
const subtitle = 'Introduction';
const chart_title = 'Boxplot of Data Science Jobs Salary';
const chart_description = 'Data science is an emerging field with high salaries. Look at the boxplot to learn its salary range!<br><br><i>*Key takeaway: be the data science person represented as rightwards as possible in the boxplot.*</i>';
const description_lines = chart_description.split('<br>');
const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "rgba(0, 0, 0, 0.7)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "5px")
            .style("font-weight", "bold");

// Render function
const render = data => {
    // Title
    const title = svg.append('text')
        .attr('x', inner_width / 2)
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '32px')
        .attr('font-weight', 'bold')
        .text('Everything You Must Know about Data Science Jobs in the Early 2020s');

    // Buttons
    const buttons = svg.append('g')
        .attr('transform', `translate(${(inner_width - (button_width * 2 + button_margin * 2)) / 2}, ${margin.top + 30})`);
    button_data.forEach(d => {
        const button = buttons.append('g')
            .attr('class', 'button')
            .style('cursor', 'pointer')
            .on('click', () => {
                window.location.href = d.link;
            });
        
        button.append('rect')
            .attr('x', d.x)
            .attr('y', d.y)
            .attr('width', button_width)
            .attr('height', button_height)
            .attr('rx', 10)
            .attr('ry', 10)
            .style('fill', 'yellow')
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('cursor', 'pointer');
        button.append('text')
            .attr('x', d.x + button_width / 2)
            .attr('y', d.y + button_height / 2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('fill', 'black')
            .style('pointer-events', 'none')
            .text(d.label);
    });
    
    // Chart
    const chart = svg.append('g')
        .attr('transform', `translate(${inner_width - 1080}, ${margin.top + 130})`);
    
    // Subtitle
    chart.append('text')
        .attr('x', -65)
        .attr('y', 0)
        .attr('fill', 'white')
        .attr('font-size', '24px')
        .attr('text-decoration', 'underline')
        .text(subtitle);

    // Chart Title
    chart.append('text')
        .attr('x', inner_width - 990)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '24px')
        .text(chart_title)
    
    // Boxplot
    const values = data.map(d => d.salary_in_usd);
    const values_sorted = values.sort(d3.ascending)
    const q1 = d3.quantile(values_sorted, 0.25);
    const median = d3.quantile(values_sorted, 0.5);
    const q3 = d3.quantile(values_sorted, 0.75);
    const interQuantileRange = q3 - q1;
    const min = Math.max(d3.min(values_sorted), q1 - 1.5 * interQuantileRange);
    const theoritical_max = q3 + 1.5 * interQuantileRange;
    const real_max = d3.max(values_sorted);

    const x_scale = d3.scaleLinear()
        .domain([0, real_max])
        .range([0, inner_width/1.8]);
    
    const center = 200;
    const height = 100;

    const boxplot = chart.append('g')
        .attr('x', 0)
        .attr('y', 200)
    boxplot.append("rect")
        .attr("x", x_scale(q1))
        .attr("y", center - height / 2)
        .attr("height", height)
        .attr("width", x_scale(q3) - x_scale(q1))
        .attr("stroke", "#f28e2b")
        .attr("fill", "#f28e2b");
    boxplot.append("line")
        .data(values)
        .attr("x1", x_scale(min))
        .attr("x2", x_scale(theoritical_max))
        .attr("y1", center)
        .attr("y2", center)
        .attr("stroke", "#f28e2b")
        .attr("stroke-width", 4)

    boxplot.selectAll("toto")
        .data([min, median, theoritical_max])
        .enter()
        .append("line")
          .attr("x1", function(d){ return(x_scale(d))})
          .attr("x2", function(d){ return(x_scale(d))})
          .attr("y1",  center - height / 2)
          .attr("y2", center + height / 2)
          .attr("stroke", "#4e79a7")
          .attr("stroke-width", 4)

    boxplot.append("text")
        .attr('x', x_scale(min))
        .attr('y', center + 70)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9DEC67')
        .attr('font-size', '12px')
        .text("Lower fence: $" + d3.format(",")(min));

    boxplot.append("text")
        .attr('x', x_scale(median))
        .attr('y', center + 70)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9DEC67')
        .attr('font-size', '12px')
        .text("Median: $" + d3.format(",")(median));

    boxplot.append("text")
        .attr('x', x_scale(theoritical_max))
        .attr('y', center + 70)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9DEC67')
        .attr('font-size', '12px')
        .text("Upper fence: $" + d3.format(",")(theoritical_max));

    boxplot.append("text")
        .attr('x', x_scale(real_max))
        .attr('y', center + 70)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9DEC67')
        .attr('font-size', '12px')
        .text("Maxima: $" + d3.format(",")(real_max));

    chart.selectAll(".data-point")
        .data(data.filter(d => d.salary_in_usd > theoritical_max))
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => x_scale(d.salary_in_usd))
        .attr("cy", center)
        .attr("r", 2)
        .style("fill", "red")

    chart.selectAll(".data-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => x_scale(d.salary_in_usd))
        .attr("cy", center)
        .attr("r", 4)
        .style("opacity", "0")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<b>Salary:</b> $${d3.format(",")(d.salary_in_usd)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
          })
          .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
          })
          .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
          });
          
    const xaxis_tick_format = number => d3.format(".2s")(number).replace("M", "K");
    boxplot.append("g")
        .attr("transform", `translate(${0}, ${380})`)
        .call(d3.axisBottom(x_scale).tickFormat(xaxis_tick_format));
    
    // Chart Description
    chart.append('foreignObject')
        .attr('x', 0)
        .attr('y', 465)
        .attr('width', inner_width)
        .attr('height', 200) // Adjust height as needed
        .append('xhtml:div')
        .style('color', 'white')
        .style('font-size', '18px')
        .html(chart_description);
};

// Load data
d3.csv('../salaries.csv', d3.autoType).then(data => {
    render(data);
});
