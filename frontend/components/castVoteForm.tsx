import type { FormEventHandler } from 'react'

type Props = {
  onSubmit?: FormEventHandler<HTMLFormElement>
  className?: string
  voteOptions: string[]
}

const CastVoteForm: React.FC<Props> = ({
  onSubmit = () => {},
  className,
  voteOptions,
}) => {
  const options = voteOptions.map((item, i) => (
    <label className="radio" key={i}>
      <span>{item}</span>
      <input type="radio" name="vote" id={`option_${item}`} value={item} />
      <span className="checkmark" />
    </label>
  ))

  return (
    <form onSubmit={onSubmit} className={className}>
      <div>{options}</div>
      <button type="submit">Vote</button>
    </form>
  )
}

export default CastVoteForm
