const fs = require("fs")
const path = require("path")
const meow = require("meow")

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

    const cli = meow(
      `
	Usage
	  $ rename-project --organizationName chocolat-chaud-io --projectName stator

	Options
	  --organizationName, -on  The name of your github organization or personal account
	  --projectName,      -pn  The name of the project

	Examples
	  $ rename-project --organizationName chocolat-chaud-io --projectName stator
`,
      {
        flags: {
          organizationName: {
            type: "string",
            alias: "on",
            isRequired: true,
          },
          projectName: {
            type: "string",
            alias: "pn",
            isRequired: true,
          },
        },
      }
    )

    const organizationNameRegex = /^[a-zA-Z-\d_]+$/gim
    const organizationName = cli.flags.organizationName
    if (!organizationNameRegex.test(organizationName)) {
      console.error("The organization name must respect this regex /^[a-zA-Z-\\d_]+$/gmi")
      process.exit(1)
    }

    const projectRegex = /^[a-zA-Z-\d_]+$/gim
    const projectName = cli.flags.projectName
    if (!projectRegex.test(projectName)) {
      console.error("The project name must respect this regex /^[a-zA-Z-\\d_]+$/gmi")
      process.exit(1)
    }

    for await (const entry of walk(path.join(__dirname, ".."), ignoredFolders)) {
      const entryStat = await fs.promises.lstat(entry)
      if (entryStat.isFile()) {
        const fileContent = await fs.promises.readFile(entry, "utf-8")
        if (fileContent) {
          const replacedFileContent = fileContent.replace(/chocolat-chaud-io/gim, organizationName).replace(/stator/gim, projectName)
          await fs.promises.writeFile(entry, replacedFileContent, "utf-8")
        }
      }
    }

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
