import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventReducer from '../features/events/eventSlice'
import instructionReducer from '../features/instructions/instructionSlice'
import productReducer from '../features/products/productSlice'
import languageReducer from '../features/languages/languageSlice'




export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    instructions: instructionReducer,
    languages: languageReducer,
    productReducer: productReducer
  }
   
})
