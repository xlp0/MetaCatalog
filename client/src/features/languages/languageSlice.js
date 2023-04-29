import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import languageService from './languageService'

const initialState = {
  languages: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// get instructions
export const getLanguages = createAsyncThunk(
  'languages/get',
  async (thunkAPI) => {
    try {
      return await languageService.getLanguages()
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

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLanguages.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getLanguages.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.languages = action.payload
        // console.log("GET LANGUAGES" + JSON.stringify(state.languages))
      })
      .addCase(getLanguages.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = languageSlice.actions
export default languageSlice.reducer
