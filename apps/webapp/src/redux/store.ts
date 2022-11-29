import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { addGeneratedCacheKeys } from "./endpoints/generated-cache-keys"
import { errorMiddleware } from "./middlewares/error-middleware"
import { api } from "./api"
import { snackbarThunksSlice } from "./thunks-slice/snackbar-thunks-slice"

addGeneratedCacheKeys()

export const rootReducer = combineReducers({
  snackbarReducer: snackbarThunksSlice.reducer,
  [api.reducerPath]: api.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const isSuccess = (response: { type: string }) => !!response?.type?.includes("fulfilled")

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(errorMiddleware())
      .concat(api.middleware),
})
setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
