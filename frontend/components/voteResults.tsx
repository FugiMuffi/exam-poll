import { FunctionComponent, useState } from "react";
import styles from 'styles/Poll.module.scss'
import ResultPieChart from "components/resultsPieChart";
import ResultBarChart from "components/resultsBarChart";

type Props = {
  results: {
    [option: string]: number;
  };
};


const VoteResults: FunctionComponent<Props> = ({ results }) => {
  const [showBarChart, setShowBarChart] = useState(true);

  const Chart = showBarChart ? ResultBarChart : ResultPieChart;

  return (
    <>
      <Chart results={results} />

      { Object.entries(results).filter( ([_, value]) => value > 0 ).length > 0
        ? <p>Failure Rate: {calculateFailureRate(results)}%</p>
        : ''
      }

      <button className={styles.resultButton} onClick={() => setShowBarChart(!showBarChart)}>
        Show {showBarChart ? 'Pie' : 'Bar'} Chart
      </button>
    </>
  );
};

function calculateFailureRate(results : Props["results"]) {
  return Math.round(results['5.0'] / Object.entries(results).map(([_, value]) => value).reduce((s : any, a : any) => s + a, 0) * 100);
}

export default VoteResults;
