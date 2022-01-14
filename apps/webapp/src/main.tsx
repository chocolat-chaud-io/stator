import { ThemeProvider, createTheme } from "@mui/material"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import { App } from "./app/app"
import { store } from "./redux/store"

const theme = createTheme({
  components: {
    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingTop: 24,
        },
      },
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
