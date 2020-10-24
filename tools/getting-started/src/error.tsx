import { Text } from "ink"
import React from "react"

interface Props {
  errorMessage: string
}

const Error: React.FC<Props> = props => {
  return <Text>{!!props.errorMessage && <Text color="red">{props.errorMessage}</Text>}</Text>
}

export default Error
