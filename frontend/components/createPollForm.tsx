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
  duration = ""
}) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <input type="text" id="poll_title" name="title" defaultValue={title} placeholder="Title" required />

      <input type="text" id="poll_description" name="description" defaultValue={description} placeholder="Description" />

      <select id="poll_duration" name="duration" defaultValue={duration} disabled={edit} required>
        <option value="" disabled hidden>Duration</option>
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
