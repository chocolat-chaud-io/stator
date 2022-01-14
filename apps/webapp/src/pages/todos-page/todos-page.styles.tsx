import { Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"

export const useTodosPageStyles = makeStyles((theme: Theme) => ({
  addTodoContainer: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gridGap: theme.spacing(2),
    alignItems: "center",
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  cardContent: {
    display: "grid",
  },
  getLoadingProgress: {
    justifySelf: "center",
  },
  listItemSecondaryAction: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  updateTextField: {
    marginRight: theme.spacing(9),
  },
}))
