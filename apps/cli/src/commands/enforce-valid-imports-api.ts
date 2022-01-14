import fs from "fs"
import path from "path"

import { Command } from "clipanion"

import { walk } from "../utils"

export class EnforceValidImportsApi extends Command {
  static paths = [["enforce-valid-imports-api"]]

  static usage = Command.Usage({
    category: "enforcers",
    description:
      "This script will make sure that your imports are valid in the API. This is used to avoid import errors than can be hard to spot.",
    examples: [["A basic example", "npm run stator-cli enforce-valid-imports-api"]],
  })

  async execute(): Promise<number | void> {
    const invalidImportRegex = /import .*stator\/[a-zA-Z]+\//gm
    const fileContainingInvalidImports = []

    async function validateEntryName(entry) {
      const fileContent = await fs.promises.readFile(entry, { encoding: "utf-8" })
      const match = fileContent.match(invalidImportRegex)
      if (match) {
        fileContainingInvalidImports.push(entry)
      }
    }

    for await (const entry of walk(path.join(__dirname, "../apps/api/src"), [])) {
      await validateEntryName(entry)
    }

    if (fileContainingInvalidImports.length > 0) {
      const errorMessage = `${fileContainingInvalidImports.length} file(s) have invalid imports. They should NOT look like this: "@stator/models/something/entity"`

      console.error(errorMessage)
      console.error(fileContainingInvalidImports)

      process.exit(1)
    }

    console.info("Congratulations, all your imports in api are valid!")
  }
}
