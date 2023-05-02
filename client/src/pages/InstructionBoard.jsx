import { useState, useEffect } from 'react'
import { getInstructions, executeInstruction } from '../features/instructions/instructionSlice'
import { useDispatch, useSelector } from 'react-redux'


const InstructionBoard = () => {

  const { instructions, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.instructions
  )
  
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    instruction: '',
    parameters: '',
  })

  const [executionResult, setExecutionResult] = useState("")

  const { instruction, parameters } = formData


  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(executeInstruction(formData))
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const getAvailableInstructions = async (e) => {
    await dispatch(getInstructions())
  }

   useEffect(() => {
    setExecutionResult(JSON.stringify(instructions))
   }, [instructions, isLoading])

  return (
    <>
      <div>InstructionBoard</div>
      <h2>Try to submit an Instruction to the server</h2>
      <button onClick={getAvailableInstructions} >Get Instruction Button</button>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              className='form-control'
              id='instruction'
              name='instruction'
              value={instruction}
              placeholder='Enter a known instruction (ls, cat, ...))'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              className='form-control'
              id='parameters'
              name='parameters'
              value={parameters}
              placeholder='Enter relevant parameters'
              onChange={onChange}
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
        <h3>OUTPUT OF INSTRUCTION</h3>
        <h4>{executionResult}</h4>
      </section>
    </>
  )
}

export default InstructionBoard