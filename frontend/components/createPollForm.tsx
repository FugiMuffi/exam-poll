import type { FunctionComponent, FormEventHandler } from 'react'

type Props = {
  onSubmit?: FormEventHandler<HTMLFormElement>,
  className?: string,
  edit?: boolean,
  title?: string,
  description?: string,
  duration?: string
}

const CreatePollForm: FunctionComponent<Props> = ({
  onSubmit = () => {},
  className,
  edit = false,
  title,
  description,
  duration = "1d"
}) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <label htmlFor="poll_title">Title</label>
      <input type="text" id="poll_title" name="title" defaultValue={title} />

      <label htmlFor="poll_description">Description</label>
      <input type="text" id="poll_description" name="description" defaultValue={description} />

      <label htmlFor="poll_duration">Duration</label>
      <select id="poll_duration" name="duration" defaultValue={duration} disabled={edit}>
        <option value="4h">4h</option>
        <option value="8h">8h</option>
        <option value="12h">12h</option>
        <option value="1d">1d</option>
        <option value="2d">2d</option>
        <option value="4d">4d</option>
        <option value="7d">7d</option>
      </select>

      <button type="submit">{ edit ? "Edit Poll" : "Create Poll" }</button>
    </form>
  )
}

export default CreatePollForm
