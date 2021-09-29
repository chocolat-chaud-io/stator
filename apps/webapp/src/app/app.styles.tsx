import { Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

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
