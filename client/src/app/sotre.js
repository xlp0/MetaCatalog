import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventReducer from '../features/events/eventSlice'
import instructionReducer from '../features/instructions/instructionSlice'



export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    instructions: instructionReducer
  },
})
