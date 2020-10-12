import { CircularProgress, IconButton, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { ComponentType, ReactNode } from "react"
import { FC } from "react"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    position: "relative",
  },
  progress: {
    position: "absolute",
    top: 2,
    left: 2,
    zIndex: 1,
  },
}))

interface Props {
  loading: boolean
  Icon: ComponentType
  onClick: () => void
}

export const LoadingIconButton: FC<Props> = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <IconButton edge="end" onClick={props.onClick} disabled={props.loading}>
        <props.Icon />
      </IconButton>
      {props.loading && <CircularProgress size={45} className={classes.progress} />}
    </div>
  )
}
