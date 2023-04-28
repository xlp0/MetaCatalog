import axios from 'axios'

const API_URL = '/api/instructions/'


// Get available instructions
const getInstructions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Execute incoming instruction
const executeInstruction = async (instructionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, instructionData, config)

  return response.data
}

const instructionService = {
  getInstructions,
  executeInstruction
}

export default instructionService
