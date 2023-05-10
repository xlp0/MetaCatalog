import { createSlice } from '@reduxjs/toolkit'

const item = JSON.parse(localStorage.getItem('item'))

const initialState = {
  item: item ? item :null
}


export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    selectItem : (state, action) => {
        console.log("itemSlice's selectItem has been fired :" + JSON.stringify(action.payload) )
        state.item = action.payload;
        console.log("itemSlice's state.item after assignment :" + JSON.stringify(state.item) )

    }
  }
})

export default itemSlice.reducer
export const { selectItem } = itemSlice.actions;
export const someItem = (state) => state.item;