const fs = require("fs")
const path = require("path")

async function* walk(dir, ignoredPaths) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory() && !ignoredPaths.includes(d.name)) yield* walk(entry, ignoredPaths)
    else if (d.isFile()) yield entry
  }
}

async function main() {
  try {
    const ignoredFolders = ["node_modules", "dist", ".git", ".idea", ".cache"]
    const args = process.argv.slice(2)
    if (args.length < 2 || args[0] !== "--project-name" || args[1].length === 0) {
      console.error("You must set the project name using --project-name {PROJECT_NAME}")
      return
    }

    const projectName = args[1]

    for await (const entry of walk(path.join(__dirname, '..'), ignoredFolders)) {
      const entryStat = await fs.promises.lstat(entry)
      if (entryStat.isFile()) {
        const fileContent = await fs.promises.readFile(entry, "utf-8")
        if (fileContent) {
          const replacedFileContent = fileContent.replace(/stator/gim, projectName)
          await fs.promises.writeFile(entry, replacedFileContent, "utf-8")
        }
      }
    }

    await fs.promises.unlink("./tools/rename-project.js")
    console.log("This is now YOUR project provided generously by:")
    console.log(`
███████ ████████  █████  ████████  ██████  ██████ 
██         ██    ██   ██    ██    ██    ██ ██   ██ 
███████    ██    ███████    ██    ██    ██ ██████  
     ██    ██    ██   ██    ██    ██    ██ ██   ██ 
███████    ██    ██   ██    ██     ██████  ██   ██ 
                                                   
    `)
  } catch (err) {
    console.error(err)
  }
}
main()
