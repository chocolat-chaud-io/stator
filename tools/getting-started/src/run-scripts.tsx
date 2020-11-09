import path from "path"

import { Box, Text, useApp } from "ink"
import Spinner from "ink-spinner"
import React, { useEffect, useState } from "react"

import Error from "./error"
import IsValidIcon from "./is-valid-icon"

const util = require("util")
const exec = util.promisify(require("child_process").exec)

interface Props {
  projectName: string
  organizationName: string
  digitalOceanToken: string
}

const projectRootPath = path.join(__dirname, "../../../")

const RunScripts: React.FC<Props> = props => {
  const { exit } = useApp()

  const [isRenamingProject, setIsRenamingProject] = useState(false)
  const [isRenamingProjectValid, setIsRenamingProjectValid] = useState<boolean>()
  const [renameProjectOutput, setRenameProjectOutput] = useState("")

  const [isDeployingApplication, setIsDeployingApplication] = useState(false)
  const [isDeployingApplicationValid, setIsDeployingApplicationValid] = useState(
    !!props.digitalOceanToken ? undefined : true
  )

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const asyncFn = async () => {
      setIsRenamingProject(true)

      const { stdout } = await exec(
        `npm --prefix ${projectRootPath} run rename-project -- --organization ${props.organizationName} --project ${props.projectName}`
      )

      const validationText = "This is now YOUR project"
      const isValid = stdout.includes(validationText)
      if (!isValid) {
        setErrorMessage(stdout)
      }

      setIsRenamingProject(false)
      setIsRenamingProjectValid(isValid)
      setRenameProjectOutput(`${validationText}${stdout.split(validationText)[1]}`.trim())
    }
    asyncFn()
      .then()
      .catch(err => setErrorMessage(err.message))
  }, [])

  useEffect(() => {
    if (renameProjectOutput && props.digitalOceanToken) {
      const asyncFn = async () => {
        setIsDeployingApplication(true)

        const { stdout } = await exec(`doctl apps create --spec ${projectRootPath}.do/app.yaml`)

        const isValid = stdout.includes(props.projectName)
        if (!isValid) {
          setErrorMessage(stdout)
        }

        setIsDeployingApplication(false)
        setIsDeployingApplicationValid(isValid)
      }
      asyncFn()
        .then()
        .catch(err => setErrorMessage(err.message))
    }
  }, [renameProjectOutput])

  useEffect(() => {
    if (isDeployingApplicationValid) {
      exit()
    }
  }, [isDeployingApplicationValid])

  return (
    <>
      <Box marginTop={1} />

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

      {!!props.digitalOceanToken && (
        <Box>
          <Text bold>
            {isDeployingApplication && (
              <>
                <Text color="green">
                  <Spinner />{" "}
                </Text>
              </>
            )}
            Deploying application on DigitalOcean
          </Text>
          <IsValidIcon isValid={isDeployingApplicationValid} />
        </Box>
      )}

      {isRenamingProjectValid && isDeployingApplicationValid && (
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
              npm start api
            </Text>
          </Text>
          <Text bold>
            webapp:{" "}
            <Text backgroundColor="#000" color="#fff">
              npm start webapp
            </Text>
          </Text>
        </>
      )}

      <Box marginBottom={1} />
      {!!renameProjectOutput && isDeployingApplicationValid && <Text bold>{renameProjectOutput}</Text>}
      <Error errorMessage={errorMessage} />
    </>
  )
}

export default RunScripts
