import React, { Component } from "react";
import * as d3 from "d3";

type ResultBarChartProps = {
  results: {
    [option: string]: number;
  };
}

class ResultBarChart extends Component<ResultBarChartProps> {
  divRef: React.RefObject<HTMLDivElement>;

  constructor(props: ResultBarChartProps) {
    super(props);
    this.divRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    const width = 400;
    const height = 400;
    const margin = 5;
    const barWidth = 40;

    const svg = d3
      .select(this.divRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // Just show entries which were selected at least once
    const data = Object.entries(this.props.results).filter(
      ([_, value]) => value > 0
    );

    console.log(data)

    const scale = (d : any) => height * (d / Math.max(...data.map(v => v[1])));

    if(data.length > 0) {

      svg.attr("width", (barWidth + margin) * data.length - margin)

      const g = svg
        .selectAll("g")
        .data(data.map(v => v[1]))
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate(" + i * (barWidth + margin) + ", " + (height - scale(d)) + ")";
        });
      
      g.append("rect")
        .attr("height", function(d) {
          return scale(d);
        })
        .attr("width", barWidth)
        .attr("fill", "#f7fff7");
      
      g.append("text")
        .attr("alignment-baseline", "central")
        .attr("dy", "-1em")
        .attr("text-anchor", "middle")
        .attr("dx", barWidth / 2)
        .attr("transform", function(d) {
          return "translate(" + 0 + ", " + scale(d) + ")";
        })
        .text(function(d, i) {
          return data[i][0];
        });
      
      g.append("text")
        .attr("alignment-baseline", "central")
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr("dx", barWidth / 2)
        .text(function(d, i) {
          return data[i][1];
        });
    }
  }

  render() {
    return <div ref={this.divRef}></div>;
  }
}

export default ResultBarChart;
