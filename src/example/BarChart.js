import * as d3 from "d3";

class BarChart {
    constructor() {
        let css = ` <style>
                        svg { 
                            width: 640px; 
                            height: 480px; 
                            border: 1px solid black; 
                            background-color: #fff; 
                        }
                        #myGraph rect {
                            stroke: rgb(160, 0, 0);
                            stroke-width: 1px;
                            fill : rgb(255,0,0);
                        }
                    </style>`;
        let html = `<svg id="myGraph"></svg>
                    <button id="updateButton">데이터 업데이트</button>`;

        document.head.innerHTML = css;
        document.body.innerHTML = html;

        let dataSet = [300, 130, 5, 60, 240];

        d3.select("#myGraph")
            .selectAll("rect")
            .data(dataSet)
            .enter()
            .append("rect")
            .on("click", function() {
                d3.select(this)
                    .style("fill", "cyan");
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * 25;
            })
            .attr("width", 0)
            .transition()
            .delay(function(d, i) {
                return i * 100;
            })
            //.duration(2500)
            .attr("height", "20px")

            .attr("width", function(d, i) {
                return d + "px";
            });

        d3.select('#updateButton')
            .on('click', function() {
                for(var i=0; i < dataSet.length; i++) {
                    dataSet[i] = Math.floor(Math.random() * 320);
                }

                d3.select("#myGraph")
                    .selectAll("rect")
                    .data(dataSet)
                    .transition()
                    .delay(function(d, i) {
                        return i * 100;
                    })
                    .attr("width", function(d, i) {
                        return d + "px";
                    });
            });


    }

}

export default BarChart;
