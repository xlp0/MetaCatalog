import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createEvent } from '../features/events/eventSlice'

function EventForm() {
  const [text, setText] = useState('')
  const [instruction, setInstruction] = useState('')


  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(createEvent({ text, instruction }))
    setText('')
    setInstruction('')
  }

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='text'>Event Description</label>
          <input
            type='text'
            name='text'
            id='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='instruction'>Instruction</label>
          <input
            type='text'
            name='instruction'
            id='instruction'
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Add Event
          </button>
        </div>
      </form>
    </section>
  )
}

export default EventForm
