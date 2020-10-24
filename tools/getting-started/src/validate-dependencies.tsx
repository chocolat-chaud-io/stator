import { Box, Text } from "ink"
import Link from "ink-link"
import React, { useEffect } from "react"

import IsValidIcon from "./is-valid-icon"

const exec = require("child_process").exec

interface Props {
  isDockerInstalled?: boolean
  onDockerIsInstalledChange: (isInstalled: boolean) => void
}

const ValidateDependencies: React.FC<Props> = props => {
  useEffect(() => {
    exec("docker-compose -v", (error: Error | null, stdout: string) => {
      props.onDockerIsInstalledChange(!error && stdout.toString().includes("docker-compose version"))
    })
  }, [])

  return (
    <>
      <Text bold>Validating required dependencies</Text>

      <Box marginTop={1}>
        <Text bold>docker-compose: </Text>
        <IsValidIcon isValid={props.isDockerInstalled} />
        {props.isDockerInstalled === false && (
          <Link url="https://docs.docker.com/compose/install/">
            <Text color="red" bold>
              {" "}
              Install docker-compose
            </Text>
          </Link>
        )}
      </Box>
      <Box marginBottom={1}>
        {/* Always true because we are ensuring it is installed with the package.json */}
        <Text bold>nodejs: </Text>
        <IsValidIcon isValid={true} />
      </Box>
    </>
  )
}

export default ValidateDependencies
