import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventReducer from '../features/events/eventSlice'
import instructionReducer from '../features/instructions/instructionSlice'
import productReducer from '../features/products/productSlice'
import languageReducer from '../features/languages/languageSlice'
import itemReducer from '../features/items/itemSlice'
import eoaDictionaryReducer from '../features/blockchain/eoaDictionary/eoaDictionarySlice'
import changeSubmissionReducer from '../features/blockchain/ethereum/ChangeSubmissionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    instructions: instructionReducer,
    languages: languageReducer,
    products: productReducer,
    items:itemReducer,
    eoaDictionary:eoaDictionaryReducer,
    changeSubmissionEvents:changeSubmissionReducer
  },
   
})
