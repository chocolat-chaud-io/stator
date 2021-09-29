const fs = require("fs")
const path = require("path")

const folderNames = []
async function* walk(dir, ignoredPaths = []) {
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
  const invalidImportRegex = /import .*stator\/[a-zA-Z]+\//gm
  const fileContainingInvalidImports = []

  async function validateEntryName(entry) {
    const fileContent = await fs.promises.readFile(entry, { encoding: "utf-8" })
    const match = fileContent.match(invalidImportRegex)
    if (match) {
      fileContainingInvalidImports.push(entry)
    }
  }

  for await (const entry of walk(path.join(__dirname, "../apps/api/src"))) {
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

main()
  .then()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
