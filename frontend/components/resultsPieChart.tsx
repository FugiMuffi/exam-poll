import React, { Component } from "react";
import * as d3 from "d3";

type ResultPieChartProps = {
  results: {
    [option: string]: number;
  };
}

class ResultPieChart extends Component<ResultPieChartProps> {
  divRef: React.RefObject<HTMLDivElement>;

  constructor(props: ResultPieChartProps) {
    super(props);
    this.divRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    const width = 400;
    const height = 400;
    const margin = 10;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(this.divRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d[1]);

    // Just show entries which were selected at least once
    const data = Object.entries(this.props.results).filter(
      ([_, value]) => value > 0
    );

    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(data))
      //Colorscheme
      .range(["#1a535c", "#4ecdc4", "#f7fff7", "#ff6b6b", "#ffe66d"]);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    svg
      .selectAll("arc")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d))
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("text")
      .data(pie(data))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data[0]);
  }

  render() {
    return <div ref={this.divRef}></div>;
  }
}

export default ResultPieChart;
