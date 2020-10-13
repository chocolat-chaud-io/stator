import { Todo } from "@stator/models"

import { thunkFactory } from "../utils/thunk-factory"

export const todoThunks = {
  ...thunkFactory<Todo>("/todos"),
}
