import { combineReducers } from "@reduxjs/toolkit"

import { todoSlice } from "./todos/todos.slice"

const rootReducer = combineReducers({
  todoReducer: todoSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
