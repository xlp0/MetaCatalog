import { createSlice } from '@reduxjs/toolkit'



const initialState = {
  item: null,
  priceChanged: false,
  newPrice: 0
}


export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    selectItem : (state, action) => {
        state.item = action.payload;
    },
    changePrice : (state, action) => {
      state.newPrice = action.payload;
    }
  }
})

export default itemSlice.reducer
export const { selectItem, changePrice } = itemSlice.actions;
export const selectedItem = (state) => state.items.item;
export const priceChanged = (state) => state.items.priceChanged;
export const newPrice = (state) => state.items.newPrice;