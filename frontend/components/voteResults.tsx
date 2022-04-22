import { useState } from 'react'
import styles from 'styles/Poll.module.scss'
import ResultPieChart from 'components/resultsPieChart'
import ResultBarChart from 'components/resultsBarChart'

type Props = {
  results: {
    [option: string]: number
  }
}

const VoteResults: React.FC<Props> = ({ results }) => {
  const [showBarChart, setShowBarChart] = useState(true)

  const Chart = showBarChart ? ResultBarChart : ResultPieChart

  const voteCount = Object.values(results).reduce((a, b) => a + b, 0)

  const failureRate = Math.round(results['5.0'] / voteCount * 100)

  if (voteCount === 0) {
    return <p>Nobody has voted (yet).</p>
  }

  return (
    <>
      <Chart results={results} />

      <p>Total Votes: {voteCount}</p>
      <p>Failure Rate: {failureRate}%</p>

      <button
        className={styles.resultButton}
        onClick={() => setShowBarChart(!showBarChart)}
      >
        Show {showBarChart ? 'Pie' : 'Bar'} Chart
      </button>
    </>
  )
}

export default VoteResults
