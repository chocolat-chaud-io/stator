/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/cli/src/commands/enforce-file-folder-naming-convention.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnforceFileFolderNamingConvention = void 0;
const tslib_1 = __webpack_require__("tslib");
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const clipanion_1 = __webpack_require__("clipanion");
const utils_1 = __webpack_require__("./apps/cli/src/utils.ts");
class EnforceFileFolderNamingConvention extends clipanion_1.Command {
    async execute() {
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
        ];
        const capitalLetterRegex = /[A-Z]/gm;
        const errorPathPaths = [];
        function validateEntryName(entry) {
            const entryName = path_1.default.basename(entry).replace(/\.[^/.]+$/, "");
            if (entryName.length > 0 && !ignoredPaths.includes(entryName) && entryName.match(capitalLetterRegex)) {
                errorPathPaths.push(entry);
            }
        }
        const folderNames = [];
        for await (const entry of (0, utils_1.walk)(path_1.default.join(__dirname, ".."), ignoredPaths, folderNames)) {
            validateEntryName(entry);
        }
        for (const folderName of folderNames) {
            validateEntryName(folderName);
        }
        if (errorPathPaths.length > 0) {
            const errorMessage = `${errorPathPaths.length} files/directories do not respect the kebab-case convention enforced.`;
            console.error(errorMessage);
            console.error(errorPathPaths);
            process.exit(1);
        }
        console.info("Congratulations, all your files and directories are properly named!");
    }
}
exports.EnforceFileFolderNamingConvention = EnforceFileFolderNamingConvention;
EnforceFileFolderNamingConvention.paths = [["enforce-file-folder-naming-convention"]];
EnforceFileFolderNamingConvention.usage = clipanion_1.Command.Usage({
    category: "enforcers",
    description: "This script will make sure that your folders and file use kebab-case.",
    examples: [["A basic example", "npm run stator-cli generate-cache-key-file"]],
});


/***/ }),

/***/ "./apps/cli/src/commands/enforce-valid-imports-api.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnforceValidImportsApi = void 0;
const tslib_1 = __webpack_require__("tslib");
const fs_1 = (0, tslib_1.__importDefault)(__webpack_require__("fs"));
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const clipanion_1 = __webpack_require__("clipanion");
const utils_1 = __webpack_require__("./apps/cli/src/utils.ts");
class EnforceValidImportsApi extends clipanion_1.Command {
    async execute() {
        const invalidImportRegex = /import .*stator\/[a-zA-Z]+\//gm;
        const fileContainingInvalidImports = [];
        async function validateEntryName(entry) {
            const fileContent = await fs_1.default.promises.readFile(entry, { encoding: "utf-8" });
            const match = fileContent.match(invalidImportRegex);
            if (match) {
                fileContainingInvalidImports.push(entry);
            }
        }
        for await (const entry of (0, utils_1.walk)(path_1.default.join(__dirname, "../apps/api/src"), [])) {
            await validateEntryName(entry);
        }
        if (fileContainingInvalidImports.length > 0) {
            const errorMessage = `${fileContainingInvalidImports.length} file(s) have invalid imports. They should NOT look like this: "@stator/models/something/entity"`;
            console.error(errorMessage);
            console.error(fileContainingInvalidImports);
            process.exit(1);
        }
        console.info("Congratulations, all your imports in api are valid!");
    }
}
exports.EnforceValidImportsApi = EnforceValidImportsApi;
EnforceValidImportsApi.paths = [["enforce-valid-imports-api"]];
EnforceValidImportsApi.usage = clipanion_1.Command.Usage({
    category: "enforcers",
    description: "This script will make sure that your imports are valid in the API. This is used to avoid import errors than can be hard to spot.",
    examples: [["A basic example", "npm run stator-cli enforce-valid-imports-api"]],
});


/***/ }),

/***/ "./apps/cli/src/commands/generate-cache-key-file.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenerateCacheKeyFile = void 0;
const tslib_1 = __webpack_require__("tslib");
const fs_1 = (0, tslib_1.__importDefault)(__webpack_require__("fs"));
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const clipanion_1 = __webpack_require__("clipanion");
const camelCase_1 = (0, tslib_1.__importDefault)(__webpack_require__("lodash/camelCase"));
const capitalize_1 = (0, tslib_1.__importDefault)(__webpack_require__("lodash/capitalize"));
const kebabCase_1 = (0, tslib_1.__importDefault)(__webpack_require__("lodash/kebabCase"));
const utils_1 = __webpack_require__("./apps/cli/src/utils.ts");
class GenerateCacheKeyFile extends clipanion_1.Command {
    async execute() {
        const endpointsPath = path_1.default.join(__dirname, "../apps/webapp/src/redux/endpoints");
        const importStatements = [];
        const cacheKeys = [];
        let cacheFileContent = `/**
 * This file was automatically generated by tools/generators/generate-cache-file.js file
 */

IMPORT_STATEMENTS

`;
        for await (const pathName of (0, utils_1.walk)(endpointsPath, [])) {
            const isEndpointsFile = fs_1.default.lstatSync(pathName).isFile() && pathName.includes("-endpoints");
            if (isEndpointsFile) {
                const cacheKey = (0, camelCase_1.default)(path_1.default.basename(pathName, ".ts").replace("-endpoints", ""));
                cacheKeys.push(cacheKey);
                const endpointsSelectorRegex = /build => \(({[\s\S]+overrideExisting: false,\s+})/m;
                const endpointsObjectString = fs_1.default.readFileSync(pathName, { encoding: "utf8" }).match(endpointsSelectorRegex)[1];
                const endpointSelectorRegex = /([a-z-A-Z]+): build.[qm]/gm;
                const endpointNames = [...endpointsObjectString.matchAll(endpointSelectorRegex)].map(entries => [entries[1]]).flat();
                if (endpointNames.length > 0) {
                    importStatements.push(`import { ${cacheKey}Api } from "./${(0, kebabCase_1.default)(cacheKey)}-endpoints"`);
                    cacheFileContent += `export const add${(0, capitalize_1.default)(cacheKey)}CacheKeys = () =>
  ${cacheKey}Api.enhanceEndpoints({
    endpoints: {
${endpointNames
                        .map(endpointName => {
                        const tagPropertyKey = endpointName.includes("get") ? "providesTags" : "invalidatesTags";
                        return `      ${endpointName}: { ${tagPropertyKey}: ["${cacheKey}"] },`;
                    })
                        .join("\n")}
    },
  })\n`;
                }
            }
        }
        cacheFileContent = cacheFileContent.replace("IMPORT_STATEMENTS", importStatements.map(importStatement => importStatement).join("\n"));
        cacheFileContent += `export const addGeneratedCacheKeys = () => {
  ${cacheKeys.map(cacheKey => `add${(0, capitalize_1.default)(cacheKey)}CacheKeys()`).join("\n")}
}\n`;
        fs_1.default.writeFileSync(`${endpointsPath}/generated-cache-keys.ts`, cacheFileContent, { encoding: "utf8" });
        console.info(`Generated ${endpointsPath}/generated-cache-keys.ts`);
    }
}
exports.GenerateCacheKeyFile = GenerateCacheKeyFile;
GenerateCacheKeyFile.paths = [["generate-cache-key-file"]];
GenerateCacheKeyFile.usage = clipanion_1.Command.Usage({
    category: "generators",
    description: "This script will generate the required cache key files for your redux webapp.",
    examples: [["A basic example", "npm run stator-cli generate-cache-key-file"]],
});


/***/ }),

/***/ "./apps/cli/src/commands/generate-entity-index-file.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenerateEntityIndexFile = void 0;
const tslib_1 = __webpack_require__("tslib");
const fs_1 = (0, tslib_1.__importDefault)(__webpack_require__("fs"));
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const utils_1 = __webpack_require__("./apps/cli/src/utils.ts");
const clipanion_1 = __webpack_require__("clipanion");
class GenerateEntityIndexFile extends clipanion_1.Command {
    async execute() {
        const entityIndexLockFilePath = path_1.default.join(__dirname, "entity-index-hash.txt");
        const indexFilePath = path_1.default.join(__dirname, "../libs/models/src/index.ts");
        const filePathsByFolder = {};
        for await (const entry of (0, utils_1.walk)(path_1.default.join(__dirname, "../libs/models/src/lib"), [])) {
            const folder = entry.split("lib/")[1].split("/")[0];
            if (!filePathsByFolder[folder]) {
                filePathsByFolder[folder] = [];
            }
            filePathsByFolder[folder].push(entry);
        }
        let indexFileContent = `/**
 * This file was automatically generated by generate-entity-index.js file
 * You can disable the automatic generation by removing the prepare section of the workspace.json file under api section
 */\n\n`;
        const sortedFolders = Object.entries(filePathsByFolder)
            .sort()
            .reduce((container, [key, value]) => ({ ...container, [key]: value }), {});
        for (const [folder, filePaths] of Object.entries(sortedFolders)) {
            indexFileContent += `// ${folder}\n`;
            indexFileContent += getExportLinesFromFilePaths(filePaths);
            indexFileContent += "\n";
        }
        const entityIndexLockFileExists = fs_1.default.existsSync(entityIndexLockFilePath);
        const existingEntityHash = parseInt(entityIndexLockFileExists ? await fs_1.default.promises.readFile(entityIndexLockFilePath, { encoding: "utf8" }) : "");
        const currentHash = hashCode(indexFileContent);
        if (existingEntityHash !== currentHash) {
            await fs_1.default.promises.writeFile(entityIndexLockFilePath, currentHash.toString(), { encoding: "utf8" });
            await fs_1.default.promises.writeFile(indexFilePath, indexFileContent, { encoding: "utf8" });
            console.info("Generated index file for shared entity library");
        }
    }
}
exports.GenerateEntityIndexFile = GenerateEntityIndexFile;
GenerateEntityIndexFile.paths = [["generate-entity-index-file"]];
GenerateEntityIndexFile.usage = clipanion_1.Command.Usage({
    category: "generators",
    description: "This script will generate index file for the model library.",
    examples: [["A basic example", "npm run stator-cli generate-entity-index-file"]],
});
function hashCode(str) {
    let hash = 0;
    let i;
    let chr;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
function getExportLinesFromFilePaths(filePaths) {
    return filePaths
        .sort()
        .map(filePath => {
        const relevantFilePath = filePath.split("src/")[1].replace(".ts", "");
        return `export * from "./${relevantFilePath}"\n`;
    })
        .join("");
}


/***/ }),

/***/ "./apps/cli/src/commands/rename-project.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RenameProject = void 0;
const tslib_1 = __webpack_require__("tslib");
const fs_1 = (0, tslib_1.__importDefault)(__webpack_require__("fs"));
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const clipanion_1 = __webpack_require__("clipanion");
const utils_1 = __webpack_require__("./apps/cli/src/utils.ts");
class RenameProject extends clipanion_1.Command {
    constructor() {
        super(...arguments);
        this.organization = clipanion_1.Option.String({ required: true });
        this.project = clipanion_1.Option.String({ required: true });
    }
    async execute() {
        await this.renameProject();
    }
    async renameProject() {
        try {
            console.log(this.organization, this.project, __dirname);
            const organizationRegex = /^[a-zA-Z-\d_]+$/gim;
            if (!organizationRegex.test(this.organization)) {
                console.error("The organization name must respect this regex /^[a-zA-Z-\\d_]+$/gmi");
                process.exit(1);
            }
            const projectRegex = /^[a-zA-Z-\d_]+$/gim;
            if (!projectRegex.test(this.project)) {
                console.error("The project name must respect this regex /^[a-zA-Z-\\d_]+$/gmi");
                process.exit(1);
            }
            const databaseName = this.project.replace(/-/g, "_");
            const databaseFiles = ["docker-compose.yml", "seed-data.js", "init.sql", "test.ts", "orm-config.ts"];
            const ignoredFolders = ["node_modules", "dist", ".git", ".idea", ".cache"];
            for await (const entry of (0, utils_1.walk)(path_1.default.join(__dirname, "../"), ignoredFolders)) {
                const entryStat = await fs_1.default.promises.lstat(entry);
                if (entryStat.isFile()) {
                    const fileContent = await fs_1.default.promises.readFile(entry, "utf-8");
                    if (fileContent) {
                        const isDatabaseFile = databaseFiles.some(databaseFile => entry.includes(databaseFile));
                        const replacedFileContent = fileContent
                            .replace(/chocolat-chaud-io/gim, this.organization)
                            .replace(/stator/gim, isDatabaseFile ? databaseName : this.project);
                        await fs_1.default.promises.writeFile(entry, replacedFileContent, "utf-8");
                    }
                }
            }
            console.info(`This is now YOUR project provided generously by:

███████ ████████  █████  ████████  ██████  ██████ 
██         ██    ██   ██    ██    ██    ██ ██   ██ 
███████    ██    ███████    ██    ██    ██ ██████  
     ██    ██    ██   ██    ██    ██    ██ ██   ██ 
███████    ██    ██   ██    ██     ██████  ██   ██ 
                                                   
    `);
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.RenameProject = RenameProject;
RenameProject.paths = [["rename-project"]];
RenameProject.usage = clipanion_1.Command.Usage({
    category: "getting-started",
    description: "This script will rename all occurrences of stator and chocolat-chaud with your own names.",
    examples: [["A basic example", "npm run stator-cli rename-project --organization chocolat-chaud-io --project stator"]],
});


/***/ }),

/***/ "./apps/cli/src/utils.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.walk = void 0;
const tslib_1 = __webpack_require__("tslib");
const fs_1 = (0, tslib_1.__importDefault)(__webpack_require__("fs"));
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const walk = async function* (dir, ignoredPaths, walkedFolderNames = []) {
    for await (const directoryEntry of await fs_1.default.promises.opendir(dir)) {
        const entryPath = path_1.default.join(dir, directoryEntry.name);
        if (directoryEntry.isDirectory() && !ignoredPaths.includes(directoryEntry.name)) {
            walkedFolderNames.push(entryPath);
            yield* (0, exports.walk)(entryPath, ignoredPaths, walkedFolderNames);
        }
        else if (directoryEntry.isFile()) {
            yield entryPath;
        }
    }
};
exports.walk = walk;


/***/ }),

/***/ "clipanion":
/***/ ((module) => {

"use strict";
module.exports = require("clipanion");

/***/ }),

/***/ "lodash/camelCase":
/***/ ((module) => {

"use strict";
module.exports = require("lodash/camelCase");

/***/ }),

/***/ "lodash/capitalize":
/***/ ((module) => {

"use strict";
module.exports = require("lodash/capitalize");

/***/ }),

/***/ "lodash/kebabCase":
/***/ ((module) => {

"use strict";
module.exports = require("lodash/kebabCase");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ }),

/***/ "fs":
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "path":
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const clipanion_1 = __webpack_require__("clipanion");
const enforce_file_folder_naming_convention_1 = __webpack_require__("./apps/cli/src/commands/enforce-file-folder-naming-convention.ts");
const enforce_valid_imports_api_1 = __webpack_require__("./apps/cli/src/commands/enforce-valid-imports-api.ts");
const generate_cache_key_file_1 = __webpack_require__("./apps/cli/src/commands/generate-cache-key-file.ts");
const generate_entity_index_file_1 = __webpack_require__("./apps/cli/src/commands/generate-entity-index-file.ts");
const rename_project_1 = __webpack_require__("./apps/cli/src/commands/rename-project.ts");
const [, , ...args] = process.argv;
const cli = new clipanion_1.Cli({
    binaryLabel: `stator-cli`,
    binaryName: `npm run stator-cli`,
    binaryVersion: `1.0.0`,
});
cli.register(rename_project_1.RenameProject);
cli.register(generate_cache_key_file_1.GenerateCacheKeyFile);
cli.register(generate_entity_index_file_1.GenerateEntityIndexFile);
cli.register(enforce_valid_imports_api_1.EnforceValidImportsApi);
cli.register(enforce_file_folder_naming_convention_1.EnforceFileFolderNamingConvention);
cli.register(clipanion_1.Builtins.HelpCommand);
cli.runExit(args).catch(console.error);

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map