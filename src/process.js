const fs = require('fs')
const generator = require('./generator')

// Denodeify (turn into promise)
const Q = require('q')
const readdir = Q.denodeify(fs.readdir)

// Parse arguments
var processArgs = JSON.parse(process.argv[2]);

// Retrieves placeholders file names
function getPlaceholdersFileNames(placeholdersPath) {
  return readdir(placeholdersPath, 'utf8')
    .then(files => files.filter((placeholderFile) => placeholderFile.includes(".js")))
}

// Retrieve placeholder file names -> generate required files
getPlaceholdersFileNames(processArgs.placeholdersPath)
      .then(placeholdersFiles => generator.start(
        processArgs.argument.toLowerCase(),
        processArgs.placeholdersPath,
        placeholdersFiles,
        processArgs.outputDir
      ))
      .then(() => console.log("🔰\tGenerated", processArgs.argument.toLowerCase(), processArgs.type))