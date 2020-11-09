import { Box, Text, useStdin } from "ink"
import Divider from "ink-divider"
import Link from "ink-link"
import useStdoutDimensions from "ink-use-stdout-dimensions"
import React, { FC, useEffect, useState } from "react"

import LabelValueInput from "./label-value-input"
import RunScripts from "./run-scripts"
import ValidateDependencies from "./validate-dependencies"

export interface InputValue {
  value: string
  errorMessage: string
  isValid?: boolean
}
const initialInputValue: InputValue = { value: "", errorMessage: "" }

const cloneInputValueWithoutError = (inputValue: InputValue) => ({
  ...inputValue,
  errorMessage: "",
  isValid: undefined,
})
const cloneInputValueWithError = (inputValue: InputValue, errorMessage: string) => ({
  ...inputValue,
  errorMessage,
  isValid: false,
})

const Ui: FC = () => {
  const { setRawMode } = useStdin()
  const [stdoutWidth] = useStdoutDimensions()
  const dividerWidth = stdoutWidth - 1

  const [isDockerInstalled, setIsDockerInstalled] = useState<boolean>()

  const [organizationName, setOrganizationName] = useState(initialInputValue)
  const [projectName, setProjectName] = useState(initialInputValue)
  const [coverallsToken, setCoverallsToken] = useState(initialInputValue)
  const [nxCloudToken, setNxCloudToken] = useState(initialInputValue)
  const [digitalOceanToken, setDigitalOceanToken] = useState(initialInputValue)

  useEffect(() => {
    setRawMode(true)
  }, [])

  const onOrganizationNameSubmit = () => {
    setOrganizationName(value => cloneInputValueWithoutError(value))

    const organizationNameRegex = /^[a-zA-Z-\d_]+$/
    if (!organizationNameRegex.test(organizationName.value.trim())) {
      return setOrganizationName(value =>
        cloneInputValueWithError(value, "The organization name can only contain letters, numbers and '-'")
      )
    }

    setOrganizationName(value => ({ ...value, isValid: true }))
  }

  const onProjectNameSubmit = () => {
    setProjectName(value => cloneInputValueWithoutError(value))

    const projectNameRegex = /^[a-zA-Z-\d_]+$/
    if (!projectNameRegex.test(projectName.value.trim())) {
      return setProjectName(value =>
        cloneInputValueWithError(value, "The project name can only contain letters, numbers and '-'")
      )
    }

    setProjectName(value => ({ ...value, isValid: true }))
  }

  const onCoverallsSubmit = () => {
    setCoverallsToken(value => cloneInputValueWithoutError(value))

    const tokenRegex = /^[a-zA-Z\d]{30,40}$/
    if (coverallsToken.value !== "" && !tokenRegex.test(coverallsToken.value.trim())) {
      return setCoverallsToken(value =>
        cloneInputValueWithError(value, "The token you provided doesn't respect the coveralls token format")
      )
    }

    setCoverallsToken(value => ({ ...value, isValid: true }))
  }

  const onNxCloudTokenSubmit = () => {
    setNxCloudToken(value => cloneInputValueWithoutError(value))

    const tokenRegex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
    if (nxCloudToken.value !== "" && !tokenRegex.test(nxCloudToken.value.trim())) {
      return setNxCloudToken(value =>
        cloneInputValueWithError(value, "The token you provided doesn't respect the NX cloud token format")
      )
    }

    setNxCloudToken(value => ({ ...value, isValid: true }))
  }

  const onDigitalOceanTokenSubmit = () => {
    setDigitalOceanToken(value => cloneInputValueWithoutError(value))

    const tokenRegex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
    if (digitalOceanToken.value !== "" && !tokenRegex.test(digitalOceanToken.value.trim())) {
      return setDigitalOceanToken(value =>
        cloneInputValueWithError(value, "The token you provided doesn't respect the DigitalOcean token format")
      )
    }

    setDigitalOceanToken(value => ({ ...value, isValid: true }))
  }

  return (
    <>
      <ValidateDependencies isDockerInstalled={isDockerInstalled} onDockerIsInstalledChange={setIsDockerInstalled} />

      {isDockerInstalled && (
        <>
          <LabelValueInput
            label="Organization name"
            inputValue={organizationName}
            onChange={value => setOrganizationName({ ...organizationName, value })}
            onSubmit={onOrganizationNameSubmit}
          />

          {organizationName.isValid && (
            <LabelValueInput
              label="Project name"
              inputValue={projectName}
              onChange={value => setProjectName({ ...projectName, value })}
              onSubmit={onProjectNameSubmit}
            />
          )}

          {projectName.isValid && (
            <>
              <Box marginTop={1} />

              <Divider title="Coveralls" width={dividerWidth} />

              <Link url="https://coveralls.io/sign-in">
                <Text bold>1. Log in on the Coveralls website</Text>
              </Link>
              <Link url="https://coveralls.io/repos/new">
                <Text bold>2. Link your repository</Text>
              </Link>
              <Text bold>3. Click on the details of your repository</Text>
              <Text bold>4. Copy the token from the top right and paste it in the input below</Text>

              <Box marginBottom={1} />

              <LabelValueInput
                label="Coveralls token [optional]"
                placeholder="Press enter to skip"
                inputValue={coverallsToken}
                onChange={value => setCoverallsToken({ ...coverallsToken, value })}
                onSubmit={onCoverallsSubmit}
              />
            </>
          )}

          {coverallsToken.isValid && (
            <>
              <Box marginTop={1} />

              <Divider title="NX cloud" width={dividerWidth} />

              <Link url="https://nx.app/">
                <Text bold>1. Navigate to NX website</Text>
              </Link>
              <Text bold>2. Log in / Register</Text>
              <Text bold>3. Click "Set up a workspace"</Text>
              <Text bold>4. Click "No, I'm not using @nrwl/nx-cloud"</Text>
              <Text bold>5. Copy the command provided and run it locally</Text>
              <Text>
                If you are using Windows, you will need to run the following command for the previous step to work.
              </Text>
              <Text backgroundColor="#000" color="#fff">
                npm install -g nx
              </Text>
              <Text bold>
                6. Copy the accessToken that was generated in nx.json (make sure you don't lose it as it is needed for
                the following steps)
              </Text>
              <Text bold>7. [PUBLIC REPOSITORY ONLY] Replace the token in nx.json with nx_cloud_token</Text>
              <Text bold>8. Paste the token on the NX website</Text>
              <Text bold>9. Complete the set up</Text>
              <Text bold>10. Go to your Github repository → Click Settings → Click Secrets → Click New secret</Text>
              <Text bold>
                11. Secret name is NX_CLOUD_TOKEN and it's value is the accessToken we previously copied and click Add
                secret
              </Text>
              <Text bold>12. Paste the accessToken previously copied in the input below</Text>

              <Box marginBottom={1} />

              <LabelValueInput
                label="NX cloud token [optional]"
                placeholder="Press enter to skip"
                inputValue={nxCloudToken}
                onChange={value => setNxCloudToken({ ...nxCloudToken, value })}
                onSubmit={onNxCloudTokenSubmit}
              />
            </>
          )}

          {nxCloudToken.isValid && (
            <>
              <Box marginTop={1} />

              <Divider title="DigitalOcean" width={dividerWidth} />

              <Link url="https://m.do.co/c/67f72eccb557">
                <Text bold>1. Navigate to Digital Ocean website [sponsored link]</Text>
              </Link>
              <Text bold>2. Log in or create an account</Text>
              <Link url="https://www.digitalocean.com/docs/apis-clis/doctl/how-to/install/">
                <Text bold>3. Install doctl</Text>
              </Link>
              <Text bold>4. Validate that your are properly authenticated by running "doctl account get"</Text>
              <Text>If successful, you will see your email</Text>
              <Text bold>5. Paste the API token you generated in the input below</Text>

              <Box marginBottom={1} />

              <LabelValueInput
                label="DigitalOcean API token [optional]"
                placeholder="Press enter to skip"
                inputValue={digitalOceanToken}
                onChange={value => setDigitalOceanToken({ ...digitalOceanToken, value })}
                onSubmit={onDigitalOceanTokenSubmit}
              />
            </>
          )}

          {digitalOceanToken.isValid && (
            <RunScripts
              projectName={projectName.value}
              organizationName={organizationName.value}
              digitalOceanToken={digitalOceanToken.value}
            />
          )}
        </>
      )}
    </>
  )
}

module.exports = Ui
export default Ui
