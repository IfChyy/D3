var x = new Date();
var svg;
var colors = d3.scale.category10();
var test;
var xScale;
var xAxis;
var time;
var daysShowing;
var bar;
var size;
var margins;
var barsWidth;
var xAxisLabelPos;
var barsTranslate;



var daysToShow = {
    presentDay: d3.time.day.offset(new Date(), 0),
    sevenDays: d3.time.day.offset((new Date()), -6),
    fourteenDays: d3.time.day.offset(new Date(), -13),
    oneMonth: d3.time.day.offset(new Date(), -29),
    threeMonths: d3.time.day.offset(new Date(), -89),
}



function sevenDays() {
    if (document.getElementById("7Days")) {
        time = d3.time.day.offset(new Date(), -6);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);
        barsWidth = (size.width/(daysShowing+1)*0.8);

        document.getElementById("demo").innerHTML = daysShowing+1;
        barsTranslate =  margins.left + ((size.width/(daysShowing+1))-barsWidth)/2;
        xAxisLabelPos = (size.width/(daysShowing+1))/4;


        sevenDayChartChange()
    }
}
function fourteenDays() {
    if (document.getElementById("14Days")) {
        time = d3.time.day.offset(new Date(), -13);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);
        barsWidth = (size.width/(daysShowing+1)*0.8);

        document.getElementById("demo").innerHTML = daysShowing+1;

        barsTranslate =  margins.left + ((size.width/(daysShowing+1))-barsWidth)/2;
        xAxisLabelPos = (size.width/(daysShowing+1))/5;

        fourteenDaysChartChange()
    }
}
function oneMonth() {
    if (document.getElementById("30Days")) {
        time = d3.time.day.offset(new Date(), -29);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);

        document.getElementById("demo").innerHTML = daysShowing+1;

        xScale.domain([new Date(daysToShow.oneMonth), daysToShow.presentDay]);

        redrawText()
    }
}
function threeMonths(){
    if(document.getElementById("90Days")){
        time = d3.time.day.offset(new Date(), -89);

        daysShowing = Math.round((daysToShow.presentDay -
            time)/1000/60/60/24);

        document.getElementById("demo").innerHTML = daysShowing+1;
        xScale.domain([new Date(daysToShow.threeMonths), daysToShow.presentDay]);

        redrawText()
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

     margins = {
        top: 10,
        right: 20,
        bottom: 30,
        left: 50,
    };

    size = {
        width: 500 - margins.left - margins.right,
        height: 300 - margins.top - margins.bottom
    };

    daysShowing = Math.round((daysToShow.presentDay -daysToShow.sevenDays)/1000/60/60/24);
    barsWidth = (size.width/(daysShowing+1)*0.8);
    xAxisLabelPos = (size.width/(daysShowing+1))*0.3;
    barsTranslate =  margins.left + ((size.width/(daysShowing+1))-barsWidth)/2;

    svg = d3.select("#myChart")
        .append("svg")
        .attr("width", size.width + margins.left + margins.right)
        .attr("height", size.height + margins.top + margins.bottom)
        .append("g");
    // .attr('transform', 'translate(' + margins.bottom + ',' + margins.top + ')');

    var svgBorder = svg.append("rect")
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
        .orient('bottom')
        .ticks(d3.time.days, 1)
        .tickSize(10)
        .tickFormat(d3.time.format('%a%e'));

    svg.append('g')
        .attr('class', 'xAxis')
        .attr("transform", "translate(" + margins.left + "," + (size.height-margins.top) + ")")
        .call(xAxis);

    svg.select(".xAxis")
        .selectAll('line')
        .data(xScale.ticks(d3.time.days, 6), function (d) {
            return d;
        })
        .enter().append('line')
        .attr('class', 'weekticks')
        .attr('y1', 0)
        .attr('y2', 8)
        .attr('x1', xScale)
        .attr('x2', xScale);

    svg.select('.xAxis')
        .selectAll('line')
        .data(xScale.ticks(d3.time.days, 1), function (d) {
            return d;
        })
        .enter().append('line')
        .attr('class', 'dayticks')
        .attr('y1', 0)
        .attr('y2', 5)
        .attr('x1', xScale)
        .attr('x2', xScale);


    xAxisLabels = svg.select(".xAxis")
        .selectAll("text")
        .attr("class","dayText")
        .style("text-anchor", "start")
        .attr("x", xAxisLabelPos);
    //create yScale and axis with orient left

    var yScale = d3.scale.linear()
        .domain([0, d3.max(data.map(function (d) {
            return d.value;

        }))])
        .range([0,220]);

    //create bars with data
    bar = svg.append("g")
        .selectAll(".rect")
        .attr("class", "bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){
            return xScale(d.date);
        })
        .attr("y", function(d){
            return (size.height-margins.top) -yScale(d.value);
        })
        .attr("width", 50)
        .attr("height", function(d){
            return yScale(d.value);
        })
        .attr("transform", "translate(" +barsTranslate + ",0)")
        .attr("fill", function(d, i){
            return colors(i);
        });




     test = d3.select("body")
        .append("p")
         .text("barWidth " + barsWidth)
         .append("p")
         .text("labelPos " + xAxisLabelPos)
         .append("p")
         .text("day width " + size.width/(daysShowing+1))
         .append("p")
         .text("days showing " + (daysShowing+1));



}
    // function to change the graph to seven day view when button clicked
function sevenDayChartChange(){
    /*changing the scale domain to present day minus seven days
      .nice = creates nice view of the xAxis ticks and labels */
    xScale.domain([daysToShow.sevenDays, daysToShow.presentDay])
        .nice(d3.time.day);
    // changes the tick labels to day of the week + day of month
    xAxis.tickFormat(d3.time.format('%a%e'))
        .ticks(d3.time.days, 1);
    // transitions the bars to seven days with appropriete width and padding
    bar.transition().duration(1000).attr("width", barsWidth)
        .attr("x", function(d){
            return xScale(d.date);
        })
        .attr("transform" , "translate(" + barsTranslate + ",0)");
    // calling the xaxis for approprieta time period
    svg.select(".xAxis").transition().duration(1000).call(xAxis);
    // allinging the axis labels
    svg.select(".xAxis")
        .selectAll("text").style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);


    svg.selectAll("line")
        .data(xScale.ticks(d3.time.days, 1), function (d) {
        return d;
    })
        .enter().append("line");
    //test
    test.text(xAxisLabelPos);
}

// function to change the graph to fourteen day view when button clicked
function fourteenDaysChartChange(){
    /*changing the scale domain to present day minus fourteen days
     .nice = creates nice view of the xAxis ticks and labels */
    xScale.domain([daysToShow.fourteenDays, daysToShow.presentDay])
        .nice(d3.time.day);
    /* changes the tick labels to day of the week + day of month
        .ticks = change the shown labels on the axis */
    xAxis.tickFormat(d3.time.format('%b%e'))
        .ticks(d3.time.days, 1);
    // calling the xaxis for approprieta time period
    svg.select(".xAxis").transition().duration(1000).call(xAxis);
    // transitions the bars to seven days with appropriete width and padding
    bar.transition().duration(1000).attr("width", barsWidth)
        .attr("x", function(d){
            return xScale(d.date);
        })
        .attr("transform" , "translate(" + barsTranslate + ",0)");
    // allinging the axis labels
    svg.select(".xAxis")
        .selectAll("text").style("text-anchor", "start")
        .attr("dx", xAxisLabelPos);




    //test
    test.text(xAxisLabelPos);




}

function redrawText(){
    xAxis.tickFormat(d3.time.format('%b%e'));

    svg.select(".xAxis").transition().duration(1000).call(xAxis)
        .attr("x", 5);






    bar.transition().duration(1000).attr("width", size.width/(daysShowing+1)*0.8)
        .attr("x", function(d){
        return xScale(d.date);
    })


}

function data() {
    return [
        {'date': '2016-06-3', 'value': 10},
        {'date': '2016-06-4', 'value': 20},
        {'date': '2016-06-5', 'value': 30},
        {'date': '2016-06-6', 'value': 40},
        {'date': '2016-06-7', 'value': 50},
        {'date': '2016-06-8', 'value': 60},
        {'date': '2016-06-9', 'value': 70},
        {'date': '2016-06-10', 'value': 80},

    ];
}


/* function showDays() {
 window.onload = function() {
 document.getElementById("7Days").innerHTML = "SADS ";

 document.getElementById("14Days").addEventListener("onclick", fourtheenDays);
 document.getElementById("30Days").onclick = thirtyDays();
 document.getElementById("90Days").onclick = ninetyDays();

 function sevenDays() {
 return d3.time.day.offset(new Date(), -7);
 }

 function fourtheenDays() {
 return d3.time.day.offset(new Date(), -14);
 }

 function thirtyDays() {
 return d3.time.day.offset(new Date(), -30);
 }

 function ninetyDays() {
 return d3.time.day.offset(new Date(), -90);
 }
 }
 }




 function changeDays() {
 if (document.getElementById("14Days")) {
 xScale.domain([daysToShow.sevenDays, daysToShow.presentDay]);

 var t= svg.transition().duration(750);
 t.select(".xAxis").selectAll(".line")
 //  .data(xScale.domain([daysToShow.fourteenDays, daysToShow.presentDay]))
 .data(xScale.ticks(d3.time.days, 1), function (d) {
 return d;
 })
 .enter().append('line')
 .attr('y1', 0)
 .attr('y2', 5)
 .attr('x1', xScale)
 .attr('x2', xScale);


 document.getElementById("demo").innerHTML = xScale.domain();
 }
 }*/

drawChart(prepare(data()));

