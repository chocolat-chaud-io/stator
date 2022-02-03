import path from "path"

import { Command } from "clipanion"

import { walk } from "../utils"

export class EnforceFileFolderNamingConvention extends Command {
  static paths = [["enforce-file-folder-naming-convention"]]

  static usage = Command.Usage({
    category: "enforcers",
    description: "This script will make sure that your folders and file use kebab-case.",
    examples: [["A basic example", "npm run stator-cli generate-cache-key-file"]],
  })

  async execute(): Promise<number | void> {
    const ignoredPaths = [
      "node_modules",
      "dist",
      ".git",
      ".idea",
      ".gitkeep",
      ".eslintrc",
      ".cache",
      "README",
      "LICENSE",
      "CONTRIBUTING",
      "dockerfiles",
      "Dockerfile",
    ]
    const capitalLetterRegex = /[A-Z]/gm
    const errorPathPaths = []

    function validateEntryName(entry) {
      const entryName = path.basename(entry).replace(/\.[^/.]+$/, "")
      if (entryName.length > 0 && !ignoredPaths.includes(entryName) && entryName.match(capitalLetterRegex)) {
        errorPathPaths.push(entry)
      }
    }

    const folderNames = []
    for await (const entry of walk(path.join(__dirname, ".."), ignoredPaths, folderNames)) {
      validateEntryName(entry)
    }

    for (const folderName of folderNames) {
      validateEntryName(folderName)
    }

    if (errorPathPaths.length > 0) {
      const errorMessage = `${errorPathPaths.length} files/directories do not respect the kebab-case convention enforced.`

      console.error(errorMessage)
      console.error(errorPathPaths)

      process.exit(1)
    }

    console.info("Congratulations, all your files and directories are properly named!")
  }
}
