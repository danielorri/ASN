import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './features/counter/counterSlice'
import  dailyOrdersSlice  from './features/orders/dailyOrdersslice'
import certificatesSlice from './features/certicatesOfComplience/certificatesSlice'
import inventorySlice from './features/Inventory/inventorySlice'

export default configureStore({
  reducer: {
    counter: counterSlice,
    dailyOrders: dailyOrdersSlice,
    certificates: certificatesSlice,
    inventory: inventorySlice
  },
})