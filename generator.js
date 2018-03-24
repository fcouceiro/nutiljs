var sh = require('shelljs');
var fs = require('fs')
var path = require('path')
var inflection = require('inflection')
var Q = require('q')
var pipeStreams = require('pipe-streams-to-promise')

// Current Working Directory
let cwd = String(sh.pwd())

// Denodeify
let readdir = Q.denodeify(fs.readdir)
let readFile = Q.denodeify(fs.readFile)

module.exports.run = function(cliArgs) {
  return parseConfig()
    .then(config => {
      // Parse services placeholders
      return parsePlaceholders(path.join(__dirname, config.servicesPlaceholdersPath))
        .then(servicesPlaceholdersFiles => {
          generate(cliArgs, config, servicesPlaceholdersFiles)
        })
    })
}

// Parse placeholders
function parsePlaceholders(placeholdersPath) {
  return readdir(placeholdersPath, 'utf8')
    .then(files => {
      return files.filter((placeholderFile) => placeholderFile.includes(".js"))
    })
}

// Parse configuration
function parseConfig() {
  return readFile(path.join(__dirname,'gen-config.json'), 'utf8')
    .then(data => {
      return JSON.parse(data)
    });
}

// Generate files
function generate(argv, config, servicesPlaceholderFiles) {
  let serviceArg = argv.s || argv.service || null
  if (serviceArg) {
    // Transform service name
    serviceArg = inflection.pluralize(serviceArg).toLowerCase()
    console.log("🔰\tGenerating", serviceArg, "service...")

    let serviceDir = path.join(cwd, config.servicesPath, serviceArg)
    let serviceNamePlural = inflection.camelize(serviceArg)
    let serviceNameSingular = inflection.singularize(serviceNamePlural)

    // make services dir
    mkdir(path.join(cwd, config.servicesPath))

    // make service dir
    mkdir(serviceDir)

    let copies = []
    servicesPlaceholderFiles.forEach(servicePlaceholderFile => {
      // Generate service name
      let serviceName;
      if (servicePlaceholderFile.includes("NAMES")) {
        serviceName = servicePlaceholderFile.replace("NAMES", serviceNamePlural)
      }
      else if (servicePlaceholderFile.includes("NAME")) {
        serviceName = servicePlaceholderFile.replace("NAME", serviceNameSingular)
      }
      else {
        throw new Error("Failed to generate", servicePlaceholderFile)
        return
      }

      // Copy file
      let servicePath = path.join(serviceDir, serviceName)
      let servicePlaceholderPath = path.join(__dirname, config.servicesPlaceholdersPath, servicePlaceholderFile)
      copies.push(copyFile(servicePlaceholderPath, servicePath))
    });

    Q.all(copies).then(() => console.log("\t", serviceArg, "service completed ✅"))
  }

  let controllerArg = argv.c || argv.controller || null
  if (controllerArg) {
    // Transform controller name
    controllerArg = inflection.singularize(controllerArg).toLowerCase()
    console.log("🔰\tGenerating", controllerArg, "controller...")

    // make controllers dir
    mkdir(path.join(cwd, config.controllersPath))

    // Generate controller name
    let controllerPlaceholderName = path.parse(path.join(__dirname, config.controllerPlaceholderFile)).base
    let controllerName = controllerPlaceholderName.replace("NAME", controllerArg)

    // Copy file
    let controllerPath = path.join(cwd, config.controllersPath, controllerName)
    copyFile(path.join(__dirname, config.controllerPlaceholderFile), controllerPath)
      .then(() => console.log("\t", controllerArg, "controller completed ✅"))
  }
}

// Utils
function mkdir(dir) {
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir)
}

function copyFile(source, target, logEnabled) {
  // Source read stream
  let rd = fs.createReadStream(source)

  // Target write stream
  let wr = fs.createWriteStream(target)

  // Pipe source to target
  let promise = pipeStreams([rd, wr])
  if (logEnabled)
    promise.then(logCompletion)

  return promise
}

function logCompletion(writeStream) {
  if (writeStream)
    console.log(writeStream.path, "✅")
}