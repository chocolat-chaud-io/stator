import { Slice, createSlice } from "@reduxjs/toolkit"
import { Todo } from "@stator/models"

import { sliceReducerFactory } from "../utils/sliceReducerFactory"
import { SliceState, getInitialSliceState } from "../utils/SliceState"
import { todoThunks } from "./todos.thunk"

export interface TodoState extends SliceState<Todo> {}

export const todoSlice: Slice = createSlice({
  name: "todos",
  initialState: getInitialSliceState<TodoState, Todo>(),
  reducers: {},
  extraReducers: {
    ...sliceReducerFactory<Todo, TodoState>(todoThunks),
  },
})
