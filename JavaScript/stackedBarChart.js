/**
 * Created by azifchyy on 16.6.2016 г..
 */
var x = new Date();

var  margins = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 50
};

var  size = {
    width: 500 - margins.left - margins.right,
    height: 300 - margins.top - margins.bottom
};

var daysToShow = {
    presentDay: d3.time.day.offset(new Date(), 0),
    sevenDays: d3.time.day.offset((new Date()), -6),
    fourteenDays: d3.time.day.offset(new Date(), -13),
    oneMonth: d3.time.day.offset(new Date(), -29),
    threeMonths: d3.time.day.offset(new Date(), -89)
};

var daysShowing =  Math.round((daysToShow.presentDay -daysToShow.sevenDays)/1000/60/60/24);
var barsWidth = (size.width/(daysShowing+1)*0.8);
var xAxisLabelPos = (size.width/(daysShowing+1))/3;
var barsTranslate =  (margins.left + ((size.width/(daysShowing+1))-barsWidth))+1;
var svg;
var svgBorder;
var xScale;
var yScale;
var xAxis;
var yAxis;
var xGrid;
var yGrid;
var time;
var bar;
var colors = d3.scale.category10();
var transitionTime = 0;

function sevenDays() {
    if (document.getElementById("7Days")) {
        time = d3.time.day.offset(new Date(), -6);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);
        barsWidth = (size.width/(daysShowing+1)*0.8);

        document.getElementById("demo").innerHTML = daysShowing+1;
        barsTranslate =  (margins.left + ((size.width/(daysShowing+1))-barsWidth))+1;
        xAxisLabelPos = (size.width/(daysShowing+1))/3;


        sevenDayChartChange();
    }
}
function fourteenDays() {
    if (document.getElementById("14Days")) {
        time = d3.time.day.offset(new Date(), -13);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);
        barsWidth = (size.width/(daysShowing+1)*0.8);

        document.getElementById("demo").innerHTML = daysShowing+1;

        barsTranslate =  (margins.left + ((size.width/(daysShowing+1))-barsWidth))+1;
        xAxisLabelPos = (size.width/(daysShowing+1))/8;

        fourteenDaysChartChange();
    }
}
function oneMonth() {
    if (document.getElementById("30Days")) {
        time = d3.time.day.offset(new Date(), -29);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);

        barsWidth = (size.width/(daysShowing+1)*0.8);

        document.getElementById("demo").innerHTML = daysShowing+1;

        barsTranslate =  margins.left + ((size.width/(daysShowing+1))-barsWidth);
        xAxisLabelPos = (size.width/(daysShowing+1))/8;

        oneMonthDayChartChange()
    }
}
function threeMonths(){
    if(document.getElementById("90Days")){
        time = d3.time.day.offset(new Date(), -89);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);

        barsWidth = (size.width/(daysShowing+1)*0.8);

        document.getElementById("demo").innerHTML = daysShowing+1;

        barsTranslate =  margins.left + ((size.width/(daysShowing+1))-barsWidth);
        xAxisLabelPos = (size.width/(daysShowing+1))/8;

        threeMonthsDayChartChange()
    }
}

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

function drawChart(data) {

    svg = d3.select("#myChart")
        .append("svg")
        .attr("id", "testing")
        .attr("width", size.width + margins.left + margins.right)
        .attr("height", size.height + margins.top + margins.bottom)
        .append("g");
    // .attr('transform', 'translate(' + margins.bottom + ',' + margins.top + ')');

    svgBorder = svg.append("rect")
        .attr("class", "border")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", size.width + margins.left + margins.right)
        .attr("height", size.height + margins.bottom + margins.top);

    //create xScale and xAxis to be time stamped and orient bottom
    xScale = d3.time.scale()
        .domain([daysToShow.sevenDays, daysToShow.presentDay])
        .nice(d3.time.day)
        .range([0, size.width]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(d3.time.days, 1)
        .tickSize(10,25)
        .tickFormat(d3.time.format("%a%e"));
    xGrid = svg.append("g")
        .attr("class", "gridx")
        .attr("transform", "translate(" + margins.left + ","
            + (size.height + margins.top) + ")");

    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + margins.left + "," + (size.height) + ")")
        .call(xAxis);



    xAxisLabels = svg.select(".xAxis")
        .selectAll("text")
        .attr("class","dayText")
        .style("font-size",12)
        .style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);

    //create yScale and axis with orient left
    yScale = d3.scale.linear()
        .domain([0, d3.max(data.map(function (d) {
            return d.value;

        }))])
        .range([size.height, margins.top]);

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    yGrid = svg.append("g")
        .attr("class", "gridy")
        .attr("transform", "translate(" + margins.left + ",0)");

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" +margins.left + ",0)")
        .call(yAxis)
        .append("text")
        .text("days ")
        .attr("dx", (size.width-margins.left-margins.right) /2)
        .attr("dy", margins.bottom);


    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");


    /* svg.select('.xAxis')
     .selectAll('line')
     .data(xScale.ticks(d3.time.days, 1), function(d){
     return d;
     })
     .enter().append('line')
     .attr('class', 'dayticks')
     .attr('y1', 0)
     .attr('y2', 0)
     .attr('x1', xScale)
     .attr('x2', xScale);

     svg.select('.xAxis')
     .selectAll('line')
     .data(xScale.ticks(d3.time.day , 7), function(d){
     return d;
     })
     .enter().append('line')
     .attr('class', 'weekticks')
     .attr('y1', 0)
     .attr('y2', 0)
     .attr('x1', xScale)
     .attr('x2', xScale)
     .style("stroke", "red");*/
    var formatTime = d3.time.format("%e %B");

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    //create bars with data
    bar = svg.append("g")
        .selectAll("rect")
        .attr("class", "bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){
            return xScale(d.date);
        })
        .attr("y", function(d){
            return yScale(d.value);
        })
        .attr("width", barsWidth)
        .attr("height", function(d){
            return size.height- yScale(d.value);
        })
        .attr("transform", "translate(" +barsTranslate + ",0)")
        .attr("fill", function(d, i){
            return colors(i);
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html(formatTime(d.date) + "<br/>" +"Glucose level:" + d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");

        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });




}
// function to change the graph to seven day view when button clicked
function sevenDayChartChange(){
    d3.select("#testing").remove();

    drawChart(prepare(data()));


    /*changing the scale domain to present day minus seven days
     .nice = creates nice view of the xAxis ticks and labels */
    xScale.domain([daysToShow.sevenDays, daysToShow.presentDay])
        .nice(d3.time.day.utc);
    // changes the tick labels to day of the week + day of month
    xAxis.tickFormat(d3.time.format('%a%e'))
        .ticks(d3.time.day.utc, 1);
    // transitions the bars to seven days with appropriete width and padding
    bar.transition().duration(transitionTime).attr("width", barsWidth)
        .attr("x", function(d){
            return xScale(d.date);
        })
        .attr("transform" , "translate(" + barsTranslate + ",0)");
    // calling the xaxis for approprieta time period
    svg.select(".xAxis").transition().duration(transitionTime).call(xAxis);
    // allinging the axis labels
    svg.select(".xAxis")
        .selectAll("text").style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);

    svg.select(".xAxis").selectAll("line")
        .attr("y2", 10);


    // creating dayticks colored in red to show every 7-th day
    svg.select('.xAxis')
        .selectAll('.line')
        .data(xScale.ticks(d3.time.monday.utc), function(d){
            return d;
        })
        .enter().append('line')
        .attr('class', 'weekticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

    svg.selectAll(".weekticks").transition().duration(transitionTime).attr("y2", 10);

    svg.select(".gridx").transition().duration(transitionTime)
        .call(xAxis.scale(xScale)
            .tickSize(-size.height, 0, 0).tickFormat(""));

    svg.select(".gridy").transition().duration(transitionTime)
        .call(yAxis.scale(yScale)
            .tickSize(-size.width,0, 0).tickFormat(""));

}

// function to change the graph to fourteen day view when button clicked
function fourteenDaysChartChange(){
    d3.select("#testing").remove();

    drawChart(prepare(data()));
    /*changing the scale domain to present day minus fourteen days
     .nice = creates nice view of the xAxis ticks and labels */
    xScale.domain([daysToShow.fourteenDays, daysToShow.presentDay])
        .nice(d3.time.day.utc);
    /* changes the tick labels to  month number and day
     .ticks = change the shown labels on the axis */
    xAxis.tickFormat(d3.time.format('%m%.%d'))
        .ticks(d3.time.monday.utc);
    // calling the xaxis for approprieta time period
    svg.select(".xAxis").transition().duration(transitionTime).call(xAxis);
    // transitions the bars to seven days with appropriete width and padding
    bar.transition().duration(transitionTime).attr("width", barsWidth)
        .attr("x", function(d){
            return xScale(d.date);
        })
        .attr("transform" , "translate(" + barsTranslate + ",0)");
    // allinging the axis labels
    svg.select(".xAxis")
        .selectAll("text").style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);
    // creating dayticks colored in grey to show every day
    svg.select('.xAxis')
        .selectAll('line')
        .data(xScale.ticks(d3.time.days.utc,1), function(d){
            return d
        })
        .enter().append('line')
        .attr('class', 'dayticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

    // creating dayticks colored in red to show every 7-th day
    svg.select('.xAxis')
        .selectAll('.line')
        .data(xScale.ticks(d3.time.monday.utc), function(d){
            return d;
        })
        .enter().append('line')
        .attr('class', 'weekticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

    svg.selectAll(".dayticks").transition().duration(transitionTime).attr("y2", 10);
    svg.selectAll(".weekticks").transition().duration(transitionTime).attr("y2", 10);

    svg.select(".gridx").transition().duration(transitionTime)
        .call(xAxis.scale(xScale)
            .tickSize(-size.height, 0, 0).tickFormat("")
            .ticks(d3.time.monday.utc, 1));

    svg.select(".gridy").transition().duration(transitionTime)
        .call(yAxis.scale(yScale)
            .tickSize(-size.width,0, 0).tickFormat(""));



}

function oneMonthDayChartChange(){
    d3.select("#testing").remove();
    drawChart(prepare(data()));
    /*changing the scale domain to present day minus 30 days
     .nice = creates nice view of the xAxis ticks and labels */
    xScale.domain([daysToShow.oneMonth, daysToShow.presentDay])
        .nice(d3.time.day.utc);
    /* changes the tick labels to month number and day
     .ticks = change the shown labels on the axis */
    xAxis.tickFormat(d3.time.format("%m%.%d"))
        .ticks(d3.time.monday.utc);
    // calling the xaxis for approprieta time period
    svg.select(".xAxis").transition().duration(transitionTime).call(xAxis);
    // transitions the bars to seven days with appropriete width and padding
    bar.transition().duration(transitionTime).attr("width", barsWidth)
        .attr("x", function (d){
            return xScale(d.date);
        })
        .attr("transform", "translate(" + barsTranslate + ",0)");
    // allinging the axis labels
    svg.select(".xAxis")
        .selectAll("text").style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);

    // creating dayticks colored in grey to show every day
    svg.select('.xAxis')
        .selectAll('line')
        .data(xScale.ticks(d3.time.day.utc, 1), function(d){
            return d;
        })
        .enter().append('line')
        .attr('class', 'dayticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

// creating dayticks colored in red to show every 7-th day
    svg.select('.xAxis')
        .selectAll('.line')
        .data(xScale.ticks(d3.time.monday.utc), function(d){
            return d;
        })
        .enter().append('line')
        .attr('class', 'weekticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

    svg.selectAll(".weekticks").transition().duration(transitionTime).attr("y2", 10);
    svg.selectAll(".dayticks").transition().duration(transitionTime).attr("y2", 10);

    svg.select(".gridx").transition().duration(transitionTime)
        .call(xAxis.scale(xScale)
            .tickSize(-size.height, 0, 0).tickFormat("")
            .ticks(d3.time.monday.utc));

    svg.select(".gridy").transition().duration(transitionTime)
        .call(yAxis.scale(yScale)
            .tickSize(-size.width,0, 0).tickFormat(""));
}

function threeMonthsDayChartChange(){
    d3.select("#testing").remove();
    drawChart(prepare(data()));
    /*changing the scale domain to present day minus 90 days
     .nice = creates nice view of the xAxis ticks and labels */
    xScale.domain([new Date(daysToShow.threeMonths), daysToShow.presentDay])
        .nice(d3.time.day.utc);
    /* changes the tick labels to month number and day
     .ticks = change the shown labels on the axis */
    xAxis.tickFormat(d3.time.format("%m%.%d"))
        .ticks(d3.time.monday.utc);

    // calling the xaxis for approprieta time period
    svg.select(".xAxis").transition().duration(transitionTime).call(xAxis);
    // transitions the bars to seven days with appropriete width and padding
    bar.transition().duration(transitionTime).attr("width", barsWidth)
        .attr("x", function (d){
            return xScale(d.date);
        })
        .attr("transform", "translate(" + barsTranslate + ",0)");
    // allinging the axis labels
    svg.select(".xAxis")
        .selectAll("text").style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);

    // creating dayticks colored in grey to show every day
    svg.select('.xAxis')
        .selectAll('line')
        .data(xScale.ticks(d3.time.day.utc, 1), function(d){
            return d;
        })
        .enter().append('line')
        .attr('class', 'dayticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

// creating dayticks colored in red to show every 7-th day
    svg.select('.xAxis')
        .selectAll('.line')
        .data(xScale.ticks(d3.time.monday.utc), function(d){
            return d;
        })
        .enter().append('line')
        .attr('class', 'weekticks')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xScale)
        .attr('x2', xScale);

    svg.selectAll(".weekticks").transition().duration(transitionTime).attr("y2", 10);
    svg.selectAll(".dayticks").transition().duration(transitionTime).attr("y2", 10);

    svg.select(".gridx").transition().duration(transitionTime)
        .call(xAxis.scale(xScale)
            .tickSize(-size.height, 0, 0).tickFormat("")
            .ticks(d3.time.month.utc));

    svg.select(".gridy").transition().duration(transitionTime)
        .call(yAxis.scale(yScale)
            .tickSize(-size.width,0, 0).tickFormat(""));
}

function noTransitions(){
    if(document.getElementById("noTransition")){
        transitionTime = 0;
        d3.select("body").append("p").text(transitionTime);
    }
}

function withTransitions(){
    if(document.getElementById("noTransition")){
        transitionTime = 1000;
        d3.select("body").append("p").text(transitionTime);
    }
}


function data() {
    return [
        {'date': '2016-06-9', 'value': 10},
        {'date': '2016-06-10', 'value': 26},
        {'date': '2016-06-11', 'value': 35},
        {'date': '2016-06-12', 'value': 42},
        {'date': '2016-06-13', 'value': 55},
        {'date': '2016-06-14', 'value': 67},
        {'date': '2016-06-15', 'value': 70}

    ];
}



