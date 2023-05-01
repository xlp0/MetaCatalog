import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'

// Get product from localStorage
const product = JSON.parse(localStorage.getItem('product'))

const initialState = {
  product: product ? product : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register product
export const register = createAsyncThunk(
  'product/register',
  async (product, thunkAPI) => {
    try {
      return await productService.register(product)
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

// Login product
export const login = createAsyncThunk('product/login', async (product, thunkAPI) => {
  try {
    return await productService.login(product)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('product/logout', async () => {
  await productService.logout()
})

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.product = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.product = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.product = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.product = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.product = null
      })
  },
})

export const { reset } = productSlice.actions
export default productSlice.reducer
