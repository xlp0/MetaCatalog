import { createSlice } from '@reduxjs/toolkit'



const initialState = {
  item: null,
}


export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    selectItem : (state, action) => {
        state.item = action.payload;
    }
  }
})

export default itemSlice.reducer
export const { selectItem } = itemSlice.actions;
export const selectedItem = (state) => state.items.item;