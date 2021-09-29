import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit"

import { AppDispatch } from "../store"
import { snackbarThunks } from "../thunks-slice/snackbar-thunks-slice"

export const errorMiddleware = (): Middleware => {
  return (store: MiddlewareAPI<AppDispatch>) => next => (action: { type: string; error?: Error }) => {
    const { dispatch } = store
    const errorMessage = action.error?.message

    if (errorMessage) {
      dispatch(snackbarThunks.display({ message: errorMessage, severity: "error" }))
    }

    return next(action)
  }
}
