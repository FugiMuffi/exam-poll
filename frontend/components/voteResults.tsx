import type { FunctionComponent, FormEventHandler } from 'react'

type Props = {
  className?: string,
  classNameHighlight?: string,
  results: {
    [option: string]: number
  },
  userVote: string
}

const VoteResults: FunctionComponent<Props> = ({
  className,
  classNameHighlight,
  results,
  userVote
}) => {
  const li = Object.entries(results).map( ([key, value], i) =>
    <li key={i} className={ (userVote === key) ? classNameHighlight : undefined }>
      <span>{key}: </span>
      <span>{value}</span>
    </li>
  );

  return <ul className={className}>{li}</ul>
}

export default VoteResults