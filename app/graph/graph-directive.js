/**
 * Created by bjedrzejewski on 05/10/2015.
 */

angular.module('graphDirectives', []).directive('animalsGraph', [
    function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function (scope, element) {
                var originalDataSet = [];
                var keys = [];

                var margin = {top: 20, right: 30, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var chart = d3.select(element[0]).append("svg")
                    .attr("class", "chart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var availableYears = [];

                function drawGraph(keys, data) {
                    x.domain(keys.map(function (d) {
                        return d;
                    }));
                    y.domain([0, d3.max(data)]);

                    //clear the chart
                    chart.html("");

                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    chart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr({
                            transform: 'rotate(-90)'
                        })
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Number");

                    chart.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d, i) {
                            return x(keys[i]);
                        })
                        .attr("y", function (d) {
                            return y(d);
                        })
                        .attr("height", function (d) {
                            return height - y(d);
                        })
                        .attr("width", x.rangeBand());
                }

                function updateGraph(keys, data) {
                    x.domain(keys.map(function (d) {
                        return d;
                    }));
                    y.domain([0, d3.max(data)]);

                    yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    chart.select('.y').transition().duration(1000)
                        .call(yAxis);

                    chart.selectAll(".bar")
                        .data(data).transition().duration(1000)
                        .attr("class", "bar")
                        .attr("x", function (d, i) {
                            return x(keys[i]);
                        })
                        .attr("y", function (d) {
                            return y(d);
                        })
                        .attr("height", function (d) {
                            return height - y(d);
                        })
                        .attr("width", x.rangeBand());
                }

                function prepareKeys(data) {
                    keys = [];
                    keys = Object.keys(data[0]);
                    keys = keys.splice(1);
                    return keys;
                }

                function prepareDataRow(data, rowIndex) {
                    var dataSlice = Object.keys(data[rowIndex]).map(function (k) {
                        return +data[rowIndex][k]
                    });
                    dataSlice = dataSlice.splice(1);
                    return dataSlice;
                }

                function initGraph(data) {
                    originalDataSet = data;
                    keys = prepareKeys(data);
                    var rowIndex = 0;
                    var dataSlice = prepareDataRow(data, rowIndex);
                    drawGraph(keys, dataSlice);

                    var i;
                    availableYears = [];
                    for (i = 0; i < data.length; ++i) {
                        availableYears.push(data[i].Year);
                    }
                    d3.select(element[0]).selectAll('#dateSelect').remove();

                    d3.select(element[0]).append('div').attr('id', 'dateSelect')
                        .append('select')
                        .on('change', function () {
                            selectYear(document.getElementById('dateSelect').children[0].selectedIndex);
                        })
                        .selectAll("option")
                        .data(availableYears)
                        .enter()
                        .append('option')
                        .attr("name", function (d, i) {
                            return i;
                        }).text(function (d) {
                            return d;
                        });

                };

                function selectYear(y) {
                    var dataRow = prepareDataRow(originalDataSet, y);
                    updateGraph(keys, dataRow);
                }

                scope.$watch('data', function(){
                    if(scope.data && scope.data.length > 0)
                        initGraph(scope.data);
                }, true);

            }
        };
    }])
;
