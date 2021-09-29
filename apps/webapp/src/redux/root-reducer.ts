import { combineReducers } from "@reduxjs/toolkit"

import { snackbarThunksSlice } from "./thunks-slice/snackbar-thunks-slice"
import { todosSlice } from "./thunks-slice/todos-thunks-slice"

const rootReducer = combineReducers({
  snackbarReducer: snackbarThunksSlice.reducer,
  todoReducer: todosSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

export const isSuccess = (response: { type: string }) => !!response?.type?.includes("fulfilled")
