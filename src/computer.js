const fs = require('fs')
const path = require('path')
const inflection = require('inflection')
const config = require('../gen-config.json')
const generator = require('./generator')

// Get Current Working Directory
const sh = require('shelljs')
const cwd = String(sh.pwd())

// Promise handling
const Q = require('q')

// Denodeify (turn into promise)
const readdir = Q.denodeify(fs.readdir)

// Retrieves placeholders file names
function getPlaceholdersFileNames(placeholdersPath) {
  return readdir(placeholdersPath, 'utf8')
    .then(files => files.filter((placeholderFile) => placeholderFile.includes(".js")))
}

// Distribute work
function run(args) {
  // Generate services
  if (args.service) {
    let servicePlaceholders = getPlaceholdersFileNames(path.join(__dirname, config.servicesPlaceholdersPath))
      .then(servicesPlaceholdersFiles => generator.start(
        args.service.toLowerCase(),
        path.join(__dirname, config.servicesPlaceholdersPath),
        servicesPlaceholdersFiles,
        path.join(cwd, config.servicesPath, inflection.pluralize(args.service).toLocaleLowerCase())
      ))
      .then(() => console.log("🔰\tGenerated", args.service.toLowerCase(), "service..."))
  }

  // Generate controllers
  if (args.controller) {
    let controllerPlaceholders = getPlaceholdersFileNames(path.join(__dirname, config.controllersPlaceholdersPath))
      .then(controllersPlaceholdersFiles => generator.start(
        args.controller.toLowerCase(),
        path.join(__dirname, config.controllersPlaceholdersPath),
        controllersPlaceholdersFiles,
        path.join(cwd, config.controllersPath)
      ))
      .then(() => console.log("🔰\tGenerated", args.controller, "controller..."))
  }
}

// Entry-point
module.exports.run = run