import { useDispatch } from 'react-redux'
import { deleteEvent } from '../features/events/eventSlice'

function EventItem({ event }) {
  const dispatch = useDispatch()

  return (
    <div className='event'>
      <div>{new Date(event.createdAt).toLocaleString('en-US')}</div>
      <h2>{event.text}</h2>
      <h2>{event.instruction}</h2>
      <button onClick={() => dispatch(deleteEvent(event._id))} className='close'>
        X
      </button>
    </div>
  )
}

export default EventItem
