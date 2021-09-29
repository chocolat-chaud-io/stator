import { createSlice } from "@reduxjs/toolkit"
import { Todo } from "@stator/models"

import { SliceState, getInitialSliceState } from "../utils/slice-state"
import {
  thunkReducerDeleteFactory,
  thunkReducerGetAllFactory,
  thunkReducerPostFactory,
  thunkReducerPutFactory,
} from "../utils/thunk-reducer-factory"

export interface TodosState extends SliceState<Todo> {
  status: Pick<SliceState<Todo>["status"], "getAll" | "post" | "put" | "delete">
}

const getAllThunkReducer = thunkReducerGetAllFactory("todos")
const createThunkReducer = thunkReducerPostFactory<TodosState, { text: string }>("todos")
const updateThunkReducer = thunkReducerPutFactory<TodosState, unknown, { id: number }>(request => `todos/${request.id}`)
const deleteThunkReducer = thunkReducerDeleteFactory<TodosState, { id: number }>(request => `todos/${request.id}`)

export const todosSlice = createSlice({
  name: "todos",
  initialState: getInitialSliceState<TodosState>(),
  reducers: {},
  extraReducers: {
    ...getAllThunkReducer.reducers,
    ...createThunkReducer.reducers,
    ...updateThunkReducer.reducers,
    ...deleteThunkReducer.reducers,
  },
})
export const todosThunks = {
  getAll: getAllThunkReducer.thunk,
  create: createThunkReducer.thunk,
  update: updateThunkReducer.thunk,
  delete: deleteThunkReducer.thunk,
}
