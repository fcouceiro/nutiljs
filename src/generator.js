const sh = require('shelljs');
const fs = require('fs')
const path = require('path')

// Handle pluralization/singularization transforms
const inflection = require('inflection')

// Promise handling
const Q = require('q')

// Denodeify (turn into promises)
const readdir = Q.denodeify(fs.readdir)
const readFile = Q.denodeify(fs.readFile)

// Stream handling
const stream = require('stream')
const Readable = stream.Readable
const replaceStream = require('replacestream')
const sink = require('stream-sink')
const pipeStreams = require('pipe-streams-to-promise')

// Get Current Working Directory
const cwd = String(sh.pwd())

// Placeholder keys (lazy loaded)
var PLACEHOLDER_KEYS;

// Entry-point
module.exports.run = function (cliArgs) {
  return parseConfig()
    .then(config => {
      // Cache placeholder keys
      PLACEHOLDER_KEYS = config.placeholderKeys
      let modelStream = replacePlaceholderOccurrences(fs.createReadStream(path.join(__dirname, "../placeholders","models","NAME.js")), cliArgs.controller)
      console.log(cwd)
      modelStream.pipe(fs.createWriteStream(path.join(__dirname, "../test.js")))

      // sinkStream(modelStream)
      //   .then((data) => {
      //     console.log(Buffer.concat(data).toString('utf8'))
      //   })
      //   .catch((error) => {
      //     console.error(data)
      //   })

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
  return readFile(path.join(__dirname, '..', 'gen-config.json'), 'utf8')
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
      copies.push(copyFile(servicePlaceholderPath, servicePath, serviceNameSingular))
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
    copyFile(path.join(__dirname, config.controllerPlaceholderFile), controllerPath, controllerArg)
      .then(() => console.log("\t", controllerArg, "controller completed ✅"))
  }
}

// Utils
function mkdir(dir) {
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir)
}

function copyFile(source, target, replaceContent, logEnabled) {
  let streams = []

  // Source read stream
  streams.push(fs.createReadStream(source))

  // Replace text occurrences
  if (replaceContent) {
    streams.push(replaceStream("<name>", replaceContent.toLowerCase(), { ignoreCase: false }))
    streams.push(replaceStream("<NAME>", replaceContent.toUpperCase(), { ignoreCase: false }))
  }

  // Target write stream
  streams.push(fs.createWriteStream(target))

  // Pipe source to target
  let promise = pipeStreams(streams)
  if (logEnabled)
    promise.then(logCompletion)

  return promise
}

function sinkStream(stream){
  // Sink stream result as object and catch errors
  return strem.pipe(sink.object({ upstreamError: true }))
}

function logCompletion(writeStream) {
  if (writeStream)
    console.log(writeStream.path, "✅")
}