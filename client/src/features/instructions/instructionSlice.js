import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import instructionService from './instructionService'

const initialState = {
  instructions: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// get instructions
export const getInstructions = createAsyncThunk(
  'instructions/get',
  async (instructionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await instructionService.getInstructions(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Execute instruction
export const executeInstruction = createAsyncThunk(
  'instructions/execute',
  async (instructionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await instructionService.executeInstruction(instructionData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const instructionSlice = createSlice({
  name: 'instruction',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeInstruction.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.instructions.push(action.payload)
      })
      .addCase(executeInstruction.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getInstructions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getInstructions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.instructions.push(action.payload)
      })
      .addCase(getInstructions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = instructionSlice.actions
export default instructionSlice.reducer
