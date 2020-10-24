import { Box, Text } from "ink"
import React from "react"

interface Props {
  isValid?: boolean
}

const IsValidIcon: React.FC<Props> = props => {
  return (
    <>
      <Box marginLeft={1}>
        {props.isValid === true && (
          <Text bold color="green">
            ✓
          </Text>
        )}
        {props.isValid === false && (
          <Text bold color="red">
            ✗
          </Text>
        )}
      </Box>
    </>
  )
}

export default IsValidIcon
