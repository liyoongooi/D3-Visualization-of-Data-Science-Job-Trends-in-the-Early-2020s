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
const subtitle = 'Top 10 Data Science Jobs';
const chart_title = 'Data Science Jobs by Salary Increase over 4 years (2020-2023)';
const chart_description = '<i>I should be a computer vision engineer whose role is to process and analyze large data populations to <br>support the automation of predictive decision-making through visuals!</i>';
//const description_lines = chart_description.split('<br>');
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
    
    // Horizontal Barplot
    const barplot = chart.append('g')
        .attr('transform', `translate(100, 0)`);
    const top10Data = data.sort((a, b) => b.salary_increase - a.salary_increase).slice(0, 10);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(top10Data, d => d.salary_increase)])
        .range([0, inner_width/1.8]);

    const yScale = d3.scaleBand()
        .domain(top10Data.map(d => d.job_title))
        .range([0, (inner_height - margin.bottom - margin.top)/2])
        .padding(0.15);

    const bars = barplot.selectAll('.bar')
        .data(top10Data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.job_title) + 100)
        .attr('width', d => xScale(d.salary_increase))
        .attr('height', yScale.bandwidth()-7)
        .attr('fill', '#f28e2b')
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Salary Increase: $${d3.format(",")(d.salary_increase)}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    const labels = barplot.selectAll('.label')
        .data(top10Data)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.salary_increase) + 5)
        .attr('y', d => yScale(d.job_title) + yScale.bandwidth() / 2 + 96)
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .style('fill', '#9DEC67')
        .style('font-size', '14px')
        .text(d => `$${d3.format(",")(d.salary_increase)}`);

    barplot.append('g')
        .call(d3.axisLeft(yScale).tickSize(0))
        .attr('transform', `translate(0, ${95})`)
        .selectAll('text')
        .style('fill', 'white')
        .attr('font-size', '12px');

    barplot.append('g')
        .attr('transform', `translate(0, ${inner_height - margin.bottom - margin.top + 100})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .selectAll('text')
        .style('fill', 'white');
    
    // Chart Description
    chart.append('foreignObject')
        .attr('x', 0)
        .attr('y', 485)
        .attr('width', inner_width)
        .attr('height', 200) // Adjust height as needed
        .append('xhtml:div')
        .style('color', 'white')
        .style('font-size', '18px')
        .html(chart_description);
};

// Load data
d3.csv('../../data/salaries.csv', d3.autoType).then(data => {
    // Preprocessing
    data.forEach(d => {
        if (d.job_title === 'ML Engineer') {
            d.job_title = 'Machine Learning Engineer';
        }
        if (d.job_title === 'Staff Data Analyst') {
            d.job_title = 'Data Analyst';
        }
    });
    const pivoted_data = {};
    data.forEach(d => {
        if (!pivoted_data[d.job_title]) pivoted_data[d.job_title] = {};
        pivoted_data[d.job_title][d.work_year] = d.salary_in_usd;
    });

    const salary_increase_data = [];
    for (const job_title in pivoted_data) {
        const job_data = pivoted_data[job_title];
        if (job_data[2020] !== undefined && job_data[2023] !== undefined) {
            salary_increase_data.push({
                job_title,
                salary_increase: job_data[2023] - job_data[2020]
            });
        }
    }
    render(salary_increase_data);
    //render(data);
});
