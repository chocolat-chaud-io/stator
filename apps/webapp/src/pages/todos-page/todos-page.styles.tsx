import { Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

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
