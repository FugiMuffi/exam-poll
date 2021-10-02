import type { FunctionComponent, FormEventHandler } from 'react'

type Props = {
  onSubmit?: FormEventHandler<HTMLFormElement>,
  className?: string,
  voteOptions: string[]
}

const CastVoteForm: FunctionComponent<Props> = ({
  onSubmit = () => {},
  className,
  voteOptions
}) => {
  const li = voteOptions.map((item, i) =>
    <li key={i}>
      <input type="radio" name="vote" id={`option_${item}`} value={item} />
      <label htmlFor={`option_${item}`}>{item}</label>
    </li>
  )

  return (
    <form onSubmit={onSubmit} className={className}>
      <ul>{li}</ul>
      <button type="submit">Vote</button>
    </form>
  )
}

export default CastVoteForm