const fs = require("fs")
const path = require("path")

async function* walk(dir, ignoredFolders) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory() && !ignoredFolders.includes(d.name)) yield* walk(entry, ignoredFolders)
    else if (d.isFile()) yield entry
  }
}

// Then, use it with a simple async for loop
async function main() {
  try {
    const ignoredFolders = ["node_modules", "dist", ".git", ".idea"]
    const args = process.argv.slice(2)
    if (args.length < 2 || args[0] !== "--project-name" || args[1].length === 0) {
      console.error("You must set the project name using --project-name {PROJECT_NAME}")
      return
    }

    const projectName = args[1]

    for await (const entry of walk("./", ignoredFolders)) {
      const entryStat = await fs.promises.lstat(entry)
      if (entryStat.isFile()) {
        const fileContent = await fs.promises.readFile(entry, "utf-8")
        if (fileContent) {
          const replacedFileContent = fileContent.replace(/stator/g, projectName)
          await fs.promises.writeFile(entry, replacedFileContent, "utf-8")
        }
      }
    }

    await fs.promises.unlink("renameProject.js")
  } catch (err) {
    console.error(err)
  }
}
main()
