const fs = require("fs")
const path = require("path")

const folderNames = []
async function* walk(dir, ignoredPaths) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory() && !ignoredPaths.includes(d.name)) {
      folderNames.push(entry)
      yield* walk(entry, ignoredPaths)
    } else if (d.isFile()) {
      yield entry
    }
  }
}

async function main() {
  const ignoredFolders = [
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
    "dockerfiles"
  ]
  const capitalLetterRegex = /[A-Z]/gm
  const errorPathPaths = []

  function validateEntryName(entry) {
    const entryName = path.basename(entry).replace(/\.[^\/.]+$/, "")
    if (entryName.length > 0 && !ignoredFolders.includes(entryName) && entryName.match(capitalLetterRegex)) {
      errorPathPaths.push(entry)
    }
  }

  for await (const entry of walk(path.join(__dirname, ".."), ignoredFolders)) {
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

  console.log("Congratulations, all your files and directories are properly named!")
}

main()
  .then()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
