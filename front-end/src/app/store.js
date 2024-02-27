import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './features/counter/counterSlice'
import  dailyOrdersSlice  from './features/orders/dailyOrdersslice'

export default configureStore({
  reducer: {
    counter: counterSlice,
    dailyOrders: dailyOrdersSlice,
  },
})