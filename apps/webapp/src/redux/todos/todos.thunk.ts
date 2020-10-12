import { Todo } from "@stator/models"

import { thunkFactory } from "../utils/thunkFactory"

export const todoThunks = {
  ...thunkFactory<Todo>("/todos"),
}
