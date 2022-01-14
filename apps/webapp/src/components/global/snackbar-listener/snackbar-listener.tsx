import { Alert, Snackbar } from "@mui/material"
import { SnackbarCloseReason } from "@mui/material/Snackbar/Snackbar"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch, RootState } from "../../../redux/store"
import { SnackbarState, snackbarThunks } from "../../../redux/thunks-slice/snackbar-thunks-slice"

interface Props {}

export const SnackbarListener: React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const snackbarState = useSelector<RootState, SnackbarState>((state: RootState) => state.snackbarReducer)
  const [isOpened, setIsOpened] = useState(!!snackbarState.snackbar?.message)

  useEffect(() => {
    setIsOpened(!!snackbarState.snackbar?.message)
  }, [snackbarState.snackbar?.message])

  const onErrorAlertClose = (_: React.SyntheticEvent, reason?: SnackbarCloseReason) => {
    if (reason !== "clickaway") {
      setIsOpened(false)
      dispatch(snackbarThunks.clear(null))
    }
  }

  if (!snackbarState.snackbar?.message) {
    return null
  }

  return (
    <Snackbar
      data-cy={`${snackbarState.snackbar?.severity}-snackbar`}
      open={isOpened}
      autoHideDuration={3000}
      onClose={onErrorAlertClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={snackbarState.snackbar?.severity} onClose={onErrorAlertClose}>
        {snackbarState.snackbar?.message}
      </Alert>
    </Snackbar>
  )
}
