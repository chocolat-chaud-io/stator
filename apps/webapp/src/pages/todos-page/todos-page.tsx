import { Add, Delete, Done, Edit } from "@mui/icons-material"
import { Card, CardContent, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material"
import { Todo } from "@stator/models"
import React, { ChangeEvent, useEffect, useState } from "react"

import { LoadingIconButton } from "../../loading-icon-button/loading-icon-button"
import {
  useCreateOneTodoMutation,
  useDeleteOneTodoMutation,
  useGetManyTodosQuery,
  useUpdateOneTodoMutation,
} from "../../redux/endpoints/todos-endpoints"
import { useTodosPageStyles } from "./todos-page.styles"

interface Props {}

export const TodosPage: React.FC<Props> = () => {
  const classes = useTodosPageStyles()
  const { data, isLoading: isGetAllTodosLoading } = useGetManyTodosQuery({ sort: ["id,DESC"] })
  const todos = (data as unknown as Todo[]) || []
  const [createTodo, { isLoading: isCreatingTodo }] = useCreateOneTodoMutation()
  const [updateTodo, { isLoading: isUpdatingTodo }] = useUpdateOneTodoMutation()
  const [deleteTodo, { isLoading: isDeletingTodo }] = useDeleteOneTodoMutation()
  const [selectedTodo, setSelectedTodo] = useState<Todo>()
  const [todoCreateText, setTodoCreateText] = useState("")
  const [todoEditTextMap, setTodoEditTextMap] = useState(new Map<number, string>())
  const [todoEditIdMap, setTodoEditIdMap] = useState(new Map<number, boolean>())

  useEffect(() => {
    setTodoEditTextMap(todos.reduce((container, todo) => ({ ...container, [todo.id]: todo.text }), new Map<number, string>()))
  }, [todos])

  const onTodoCreateChange = (event: ChangeEvent<HTMLInputElement>) => setTodoCreateText(event.target.value)

  const onTodoUpdateChange = (todo: Todo) => (event: ChangeEvent<HTMLInputElement>) => {
    return setTodoEditTextMap({ ...todoEditTextMap, [todo.id]: event.target.value })
  }

  const onTodoCreate = async () => {
    const response = await createTodo({ todo: { text: todoCreateText } })
    if ("data" in response) {
      setTodoCreateText("")
    }
  }

  const onTodoEditClick = async (todo: Todo) => {
    setSelectedTodo(todo)
    if (todoEditIdMap[todo.id]) {
      await updateTodo({ id: todo.id, todo: { text: todoEditTextMap[todo.id] } })
      setTodoEditIdMap(todoEditIdMap => ({
        ...todoEditIdMap,
        [todo.id]: false,
      }))
    } else {
      setTodoEditIdMap(todoEditIdMap => ({
        ...todoEditIdMap,
        [todo.id]: true,
      }))
    }
  }

  const onTodoCreateKeyPress = () => async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      await onTodoCreate()
    }
  }

  const onTodoUpdateKeyPress = (todo: Todo) => async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      await onTodoEditClick(todo)
    }
  }

  return (
    <>
      <Card>
        <CardContent className={classes.addTodoContainer}>
          {!isGetAllTodosLoading && (
            <>
              <TextField
                id="create-text-field"
                label="Todo"
                value={todoCreateText}
                onChange={onTodoCreateChange}
                onKeyPress={onTodoCreateKeyPress()}
              />
              <LoadingIconButton Icon={Add} onClick={onTodoCreate} loading={isCreatingTodo} />
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className={classes.cardContent}>
          {isGetAllTodosLoading ? (
            <CircularProgress className={classes.getLoadingProgress} />
          ) : (
            <List>
              {todos.map(todo => (
                <ListItem key={todo.id}>
                  {todoEditIdMap[todo.id] && (
                    <TextField
                      placeholder="Todo"
                      value={todoEditTextMap[todo.id]}
                      onChange={onTodoUpdateChange(todo)}
                      onKeyPress={onTodoUpdateKeyPress(todo)}
                      className={classes.updateTextField}
                      data-testid="edit-text-field"
                      fullWidth
                    />
                  )}
                  {!todoEditIdMap[todo.id] && <ListItemText data-testid="todo-text" primary={todo.text} />}
                  <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
                    <LoadingIconButton
                      className="edit-icon-button"
                      loading={isUpdatingTodo && todo === selectedTodo}
                      Icon={todoEditIdMap[todo.id] ? Done : Edit}
                      onClick={() => onTodoEditClick(todo)}
                    />
                    <LoadingIconButton
                      className="delete-icon-button"
                      loading={isDeletingTodo && todo === selectedTodo}
                      Icon={Delete}
                      onClick={() => {
                        setSelectedTodo(todo)
                        deleteTodo({ id: todo.id })
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </>
  )
}
