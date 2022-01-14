import { AlertColor } from "@mui/material"
import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit"

export interface SnackbarState {
  snackbar: {
    message?: string
    severity?: AlertColor
  }
}

export const snackbarThunksSlice: Slice = createSlice({
  name: "snackbar",
  initialState: { snackbar: {} } as SnackbarState,
  reducers: {
    display(state: SnackbarState, action: PayloadAction<SnackbarState["snackbar"]>) {
      state.snackbar.message = action.payload.message
      state.snackbar.severity = action.payload.severity
    },
    clear(state: SnackbarState) {
      state.snackbar.message = ""
    },
  },
})

export const snackbarThunks = {
  display: snackbarThunksSlice.actions.display,
  clear: snackbarThunksSlice.actions.clear,
}
