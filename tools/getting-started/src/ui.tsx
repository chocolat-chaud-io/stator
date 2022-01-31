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
  const [codecovToken, setCodecovToken] = useState(initialInputValue)
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
      return setProjectName(value => cloneInputValueWithError(value, "The project name can only contain letters, numbers and '-'"))
    }

    setProjectName(value => ({ ...value, isValid: true }))
  }

  const onCodecovSubmit = () => {
    setCodecovToken(value => cloneInputValueWithoutError(value))

    const tokenRegex = /^[a-zA-Z\d-]{30,40}$/
    if (codecovToken.value !== "" && !tokenRegex.test(codecovToken.value.trim())) {
      return setCodecovToken(value => cloneInputValueWithError(value, "The token you provided doesn't respect the Codecov token format"))
    }

    setCodecovToken(value => ({ ...value, isValid: true }))
  }

  const onNxCloudTokenSubmit = () => {
    setNxCloudToken(value => cloneInputValueWithoutError(value))

    const tokenRegex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
    if (nxCloudToken.value !== "" && !tokenRegex.test(nxCloudToken.value.trim())) {
      return setNxCloudToken(value => cloneInputValueWithError(value, "The token you provided doesn't respect the NX cloud token format"))
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

              <Divider title="Codecov" width={dividerWidth} />

              <Link url="https://app.codecov.io/login/gh">
                <Text bold>1. Log in on the Codecov website</Text>
              </Link>
              <Link url="https://app.codecov.io/gh/+">
                <Text bold>2. Link your repository</Text>
              </Link>
              <Text bold>3. Copy the token from the page shown after successfully linking your repository</Text>
              <Text bold>4. Go to your Github repository → Click Settings → Click Secrets → Click New secret</Text>
              <Text bold>5. Secret name is CODECOV_TOKEN and it's value is the accessToken we previously copied and click Add secret</Text>
              <Text bold>6. Paste the token previously copied in the input below</Text>

              <Box marginBottom={1} />

              <LabelValueInput
                label="Codecov token [optional]"
                placeholder="Press enter to skip"
                inputValue={codecovToken}
                onChange={value => setCodecovToken({ ...codecovToken, value })}
                onSubmit={onCodecovSubmit}
              />
            </>
          )}

          {codecovToken.isValid && (
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
              <Text>If you are using Windows, you will need to run the following command for the previous step to work.</Text>
              <Text backgroundColor="#000" color="#fff">
                npm install -g nx
              </Text>
              <Text bold>
                6. Copy the accessToken that was generated in nx.json (make sure you don't lose it as it is needed for the following steps)
              </Text>
              <Text bold>7. [PUBLIC REPOSITORY ONLY] Replace the token in nx.json with nx_cloud_token</Text>
              <Text bold>8. Paste the token on the NX website</Text>
              <Text bold>9. Complete the set up</Text>
              <Text bold>10. Go to your Github repository → Click Settings → Click Secrets → Click New secret</Text>
              <Text bold>
                11. Secret name is NX_CLOUD_TOKEN and it's value is the accessToken we previously copied and click Add secret
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
              <Text bold>5. Generate a new SSH key by running "ssh-keygen -t rsa -b 4096 -f ~/.ssh/digitalocean-ci"</Text>
              <Text>This SSH key will be used to create review apps</Text>
              <Text bold>
                6. Let's add the new key to DigitalOcean by running "public_key=$(cat ~/.ssh/digitalocean-ci.pub); doctl compute ssh-key
                create github-ci --public-key $public_key"
              </Text>
              <Text bold>{`7. Copy your private key to your clipboard by running "xclip -sel c < ~/.ssh/digitalocean-ci"`}</Text>
              <Text bold>8. Go to your Github repository → Click Settings → Click Secrets → Click New secret</Text>
              <Text bold>
                9. Secret name is DIGITALOCEAN_SSH_KEY and it's value is the private SSH key we just copied and click Add secret
              </Text>
              <Text bold>{`10. Copy your public key to your clipboard by running "xclip -sel c < ~/.ssh/digitalocean-ci.pub"`}</Text>
              <Text bold>
                11. Secret name is DIGITALOCEAN_SSH_KEY_PUBLIC and it's value is the public SSH key we just copied and click Add secret
              </Text>
              <Link url="https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars">
                <Text bold>12. Make DigitalOcean your DNS record manager</Text>
              </Link>
              <Text>Follow the instruction by clicking the above link</Text>
              <Link url="https://cloud.digitalocean.com/account/api/tokens">
                <Text bold>13. Generate a new API token</Text>
              </Link>
              <Text bold>14. Copy the API token</Text>
              <Text bold>15. Go to your Github repository → Click Settings → Click Secrets → Click New secret</Text>
              <Text bold>
                16. Secret name is DIGITALOCEAN_ACCESS_TOKEN and it's value is the API token we previously copied and click Add secret
              </Text>
              <Text bold>17. Paste the API token you generated in the input below</Text>

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
