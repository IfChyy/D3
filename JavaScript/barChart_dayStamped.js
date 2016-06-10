function prepare(data)
{
    var dateParse = d3.time.format('%Y-%m-%d');
    data.forEach(function(v)
    {
        v.date = dateParse.parse(v.date);
    });

    var dateValueMap = data.reduce(function(r, v)
    {
        r[v.date.toISOString()] = v.value;
        return r;
    }, {});

    var dateExtent = d3.extent(data.map(function(v)
    {
        return v.date;
    }));

    // make data have each date within the extent
    var fullDayRange = d3.time.day.range(
        dateExtent[0],
        d3.time.day.offset(dateExtent[1], 1)
    );
    fullDayRange.forEach(function(date)
    {
        if(!(date.toISOString() in dateValueMap))
        {
            data.push({
                'date'  : date,
                'value' : 0
            });
        }
    });

    data = data.sort(function(a, b)
    {
        return a.date - b.date;
    });

    return data;
}
function drawChart (data) {
    var dataset = [
        ["1", 1],
        ["2", 2],
        ["3", 3],
        ["4", 4],
        ["5", 5],
        ["6", 6],
        ["7", 7],
        ["8", 8],
        ["9", 9],
        ["10", 10],
        ["11", 11],
        ["12", 12],
        ["13", 13],
        ["14", 14],


    ];


    var margins = {
        top: 20,
        right: 10,
        bottom: 50,
        left: 50
    };

    var size = {
        width: 500 - margins.left - margins.right,
        height: 300 - margins.top - margins.bottom
    };

    var svg = d3.select("#myChart")
        .append("svg")
        .attr("width", 500)
        .attr("height", 300)
        .append('g');

    var svgBorder = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 500)
        .attr("height", 300)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2);

    var dates = dataset.map(function (d) {
        return d[0];
    });
    var dates1 = data.map(function (d) {
        return d.date;
    });

    var xScale = d3.time.scale()
        .domain([d3.time.month.offset(new Date(data[0].date-1), -1), d3.time.month.offset(new Date(data[data.length -31].date),1)])
        //   .domain([d3.time.day.offset(new Date(data[0].date), -31), d3.time.day.offset(new Date(data[0].date), -1)])
        .range([0, size.width]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(data.map(function (d) {
            return d.value
        })) + margins.top])
        .range([size.height, 0]);

    var colors = d3.scale.category10();

    var barsWidth = d3.scale.ordinal()
        .domain(dates1)
        .rangeRoundBands(xScale.range(), 0.176)
        .rangeBand();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(d3.time.months, 1)//should display 1 year intervals
        .tickFormat(d3.time.format('%b'))//%Y-for year boundaries, such as 2011
        .tickSubdivide(12);//subdivide 12 months in a year

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + margins.left + "," + (size.height + margins.top) + ")")
        .call(xAxis.scale(xScale).tickSize(12).tickPadding(10))
        .selectAll("text")
        .attr("x", -size.height / 6)
        .attr("text-anchor", "start");

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis);
//razgrafqvane na skalata da ima tikche za vseki den
    d3.select('.axis.x')
        .selectAll('line')
        .data(xScale.ticks(d3.time.days.utc,7), function(d) {return d;})
        .enter().append('line')
        .attr('class', 'week-ticks')
        .attr('y1', 0)
        .attr('y2', 8)
        .attr('x1', xScale)
        .attr('x2', xScale);
    d3.select('.xaxis')
        .selectAll('line')
        .data(xScale.ticks(d3.time.days.utc,1), function(d) {return d;})
        .enter().append('line')
        .attr('class', 'day-ticks')
        .attr('y1', 0)
        .attr('y2', 5)
        .attr('x1', xScale)
        .attr('x2', xScale);

    var xGrid = svg.append("g")
        .attr("class", "grid1")
        .attr("transform", "translate(" + margins.left + "," + (size.height + margins.top) + ")")
        .call(xAxis.scale(xScale).tickSize(-size.height, 0, 0).tickFormat(""));

    var yGrid = svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis.scale(yScale).tickSize(-size.width,0, 0).tickFormat(""));



    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return xScale(d.date) - 125;
        })
        .attr("y", function (d) {
            return margins.top + yScale(d.value);
        })
        .attr("width", barsWidth)
        .attr("height", function (d) {
            return size.height - yScale(d.value);
        })
        .attr("fill", function (d, i) {
            return colors(i);
        });

    /* svg.selectAll(".air_used")
     .attr("width", function(d){
     var next = d3.time.month.offset(d.date, 1);
     return (x(next)- x(d));
     });*/

    var today = new Date();
    var test = d3.select("body")
        .append("p")
        //.text([d3.time.day.offset(new Date(data[0].date), -31), new Date(data[data.length-1].date)]);
        .text(barsWidth)

}
function data()
{
    return [

        {'date': '2016-01-08', 'value': 926.38},
        {'date': '2016-01-09', 'value': 826.38},
        {'date': '2016-01-10', 'value': 1426.38},
        {'date': '2016-01-11', 'value': 826.38},
        {'date': '2016-01-12', 'value': 1426.38},
        {'date': '2016-01-13', 'value': 1426.38},
        {'date': '2016-02-14', 'value': 826.38},


    ];
}
drawChart(prepare(data()));




