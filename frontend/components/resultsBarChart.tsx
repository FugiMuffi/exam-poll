import React, { Component } from "react";
import * as d3 from "d3";

type ResultBarChartProps = {
  results: {
    [option: string]: number;
  };
}

class ResultBarChart extends Component<ResultBarChartProps> {
  divRef: React.RefObject<HTMLDivElement>;
  data = Object.entries(this.props.results);
  barWidth = 40;
  margin = 5;
  height = 360;
  width = (this.barWidth + this.margin) * this.data.length - this.margin;

  constructor(props: ResultBarChartProps) {
    super(props);
    this.divRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    const svg = d3
      .select(this.divRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("data-chart", "bar")

    const scale = (d: any) => this.height * (d / Math.max(...this.data.map(v => v[1])));

    const g = svg
      .selectAll("g")
      .data(this.data.map(v => v[1]))
      .enter()
      .append("g")
      .attr("transform", (d, i) =>  "translate(" + i * (this.barWidth + this.margin) + ", " + (this.height - scale(d)) + ")");

    g.append("rect")
      .attr("height", d => scale(d))
      .attr("width", this.barWidth)
      .attr("fill", "#f7fff7");

    g.append("text")
      .attr("fill", "white")
      .attr("alignment-baseline", "central")
      .attr("dy", "-1em")
      .attr("text-anchor", "middle")
      .attr("dx", this.barWidth / 2)
      .attr("transform", d => "translate(" + 0 + ", " + scale(d) + ")")
      .text((d, i) => this.data[i][0]);

    g.append("text")
      .attr("fill", "white")
      .attr("alignment-baseline", "central")
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("dx", this.barWidth / 2)
      .text((d, i) => this.data[i][1]);
  }

  render() {
    return <>
      <style jsx>{`
        div {
          width: 100%;
          max-width: ${this.width}px;
          margin-bottom: 1rem;
        }
        div :global(svg text) {
          mix-blend-mode: difference;
        }
      `}</style>
      <div ref={this.divRef}></div>
    </>
  }
}

export default ResultBarChart;
