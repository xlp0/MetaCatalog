import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



const initialState = [];

// Register product
export const fetchOriginalProducts = createAsyncThunk('products/fetchOriginalProducts', async () => {


  try {
    // Fetch data from URL
    const response = await fetch(`https://ipfs.io/ipfs/${process.env.REACT_APP_IPFS_CID}?filename=${process.env.REACT_APP_IPFS_FILENAME}`)
    const laptops = await response.json()      // Flatten data
    const flattenedLaptops = laptops.map((laptop) => {return laptop?.data;})
    return flattenedLaptops;
  } catch (err) {
    console.error(err)
  }
  return null
})

 const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchOriginalProducts.fulfilled, (state, action) => {
      return action.payload;
    })
  }
})

export const selectAllProducts = (state) => state.products;

export default productSlice.reducer
