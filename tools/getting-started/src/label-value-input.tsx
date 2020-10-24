import { Box, Text } from "ink"
import TextInput from "ink-text-input"
import React from "react"

import Error from "./error"
import IsValidIcon from "./is-valid-icon"
import { InputValue } from "./ui"

interface Props {
  label: string
  placeholder?: string
  inputValue: InputValue
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

const LabelValueInput: React.FC<Props> = props => {
  return (
    <>
      <Box>
        <Text bold>{props.label}: </Text>
        <TextInput
          placeholder={props.placeholder}
          value={props.inputValue.value}
          onChange={value => props.onChange(value)}
          onSubmit={props.onSubmit}
          focus={!props.inputValue.isValid}
        />
        <IsValidIcon isValid={props.inputValue.isValid} />
      </Box>

      <Error errorMessage={props.inputValue.errorMessage} />
    </>
  )
}

export default LabelValueInput
