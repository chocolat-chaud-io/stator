import { Slice, createSlice } from "@reduxjs/toolkit"
import { Todo } from "@stator/models"

import { sliceReducerFactory } from "../utils/slice-reducer-factory"
import { SliceState, getInitialSliceState } from "../utils/slice-state"
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
