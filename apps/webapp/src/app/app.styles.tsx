import { Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"

export const useAppStyles = makeStyles((theme: Theme) => ({
  app: {
    fontFamily: "sans-serif",
    minWidth: 300,
    maxWidth: 600,
    margin: "50px auto",
  },
  cardContainer: {
    display: "grid",
    gridGap: theme.spacing(2),
  },
}))
