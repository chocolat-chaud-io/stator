import path from "path"

import { Box, Text, useApp } from "ink"
import Spinner from "ink-spinner"
import React, { useEffect, useState } from "react"

import IsValidIcon from "./is-valid-icon"

const util = require("util")
const exec = util.promisify(require("child_process").exec)

interface Props {
  projectName: string
  organizationName: string
}

const projectRootPath = path.join(__dirname, "../../../")

const RunScripts: React.FC<Props> = props => {
  const { exit } = useApp()

  const [isRenamingProject, setIsRenamingProject] = useState(false)
  const [isRenamingProjectValid, setIsRenamingProjectValid] = useState<boolean>()
  const [renameProjectOutput, setRenameProjectOutput] = useState("")

  useEffect(() => {
    const asyncFn = async () => {
      setIsRenamingProject(true)

      const { stdout } = await exec(
        `npm --prefix ${projectRootPath} run rename-project -- --organizationName ${props.organizationName} --projectName ${props.projectName}`
      )

      const validationText = "This is now YOUR project"
      setIsRenamingProject(false)
      setIsRenamingProjectValid(stdout.includes(validationText))
      setRenameProjectOutput(`${validationText}${stdout.split(validationText)[1]}`.trim())
    }
    asyncFn().then()
  }, [])

  useEffect(() => {
    if (renameProjectOutput) {
      exit()
    }
  }, [renameProjectOutput])

  return (
    <>
      <Box marginTop={1} />

      <>
        <Box>
          <Text bold>
            {isRenamingProject && (
              <>
                <Text color="green">
                  <Spinner />{" "}
                </Text>
              </>
            )}
            Renaming project
          </Text>
          <IsValidIcon isValid={isRenamingProjectValid} />
        </Box>
      </>
      {isRenamingProjectValid && (
        <>
          <Box marginTop={1} />
          <Text bold>Start your stack:</Text>
          <Box marginBottom={1} />

          <Text bold>
            database:{" "}
            <Text backgroundColor="#000" color="#fff">
              npm run postgres
            </Text>
          </Text>
          <Text bold>
            api:{" "}
            <Text backgroundColor="#000" color="#fff">
              npm run api
            </Text>
          </Text>
          <Text bold>
            webapp:{" "}
            <Text backgroundColor="#000" color="#fff">
              npm run webapp
            </Text>
          </Text>
        </>
      )}

      <Box marginBottom={1} />
      {!!renameProjectOutput && <Text bold>{renameProjectOutput}</Text>}
    </>
  )
}

export default RunScripts
