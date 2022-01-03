import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit"

import { AppDispatch } from "../store"
import { snackbarThunks } from "../thunks-slice/snackbar-thunks-slice"

export const errorMiddleware = (): Middleware => {
  return (store: MiddlewareAPI<AppDispatch>) => next => (action: { type: string; payload?: { data: { message: string } } }) => {
    const { dispatch } = store
    const errorMessage = action.payload?.data?.message

    if (errorMessage) {
      dispatch(snackbarThunks.display({ message: errorMessage, severity: "error" }))
    }

    return next(action)
  }
}
