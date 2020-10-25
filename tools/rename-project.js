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
	  $ rename-project --organization chocolat-chaud-io --project stator

	Options
	  --organization, -on  The name of your github organization or personal account
	  --project,      -pn  The name of the project

	Examples
	  $ rename-project --organization chocolat-chaud-io --project stator
`,
      {
        flags: {
          organization: {
            type: "string",
            alias: "on",
            isRequired: true,
          },
          project: {
            type: "string",
            alias: "pn",
            isRequired: true,
          },
        },
      }
    )

    const organizationRegex = /^[a-zA-Z-\d_]+$/gim
    const organization = cli.flags.organization
    if (!organizationRegex.test(organization)) {
      console.error("The organization name must respect this regex /^[a-zA-Z-\\d_]+$/gmi")
      process.exit(1)
    }

    const projectRegex = /^[a-zA-Z-\d_]+$/gim
    const project = cli.flags.project
    if (!projectRegex.test(project)) {
      console.error("The project name must respect this regex /^[a-zA-Z-\\d_]+$/gmi")
      process.exit(1)
    }

    for await (const entry of walk(path.join(__dirname, ".."), ignoredFolders)) {
      const entryStat = await fs.promises.lstat(entry)
      if (entryStat.isFile()) {
        const fileContent = await fs.promises.readFile(entry, "utf-8")
        if (fileContent) {
          const replacedFileContent = fileContent.replace(/chocolat-chaud-io/gim, organization).replace(/stator/gim, project)
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
