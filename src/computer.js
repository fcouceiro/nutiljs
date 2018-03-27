const path = require('path')
const child_process = require('child_process');
const inflection = require('inflection')
const config = require('../gen-config.json')

// Get Current Working Directory
const sh = require('shelljs')
const cwd = String(sh.pwd())

// Distribute work
function run(args) {
  // Generate services
  if (args.service) {
    let processArgs = {
      argument : args.service,
      type : 'service',
      placeholdersPath : path.join(__dirname, config.servicesPlaceholdersPath),
      outputDir : path.join(cwd, config.servicesPath, inflection.pluralize(args.service).toLowerCase())
    }

    // Spawn process
    child_process.fork('./src/process', [JSON.stringify(processArgs)]);    
  }

  // Generate controllers
  if (args.controller) {
    let processArgs = {
      argument : args.controller,
      type : 'controller',
      placeholdersPath : path.join(__dirname, config.controllersPlaceholdersPath),
      outputDir : path.join(cwd, config.controllersPath)
    }

    // Spawn process
    child_process.fork('./src/process', [JSON.stringify(processArgs)]);  
  }

  // Generate models
  if (args.model) {
    let processArgs = {
      argument : args.model,
      type : 'model',
      placeholdersPath : path.join(__dirname, config.modelsPlaceholdersPath),
      outputDir : path.join(cwd, config.modelsPath)
    }

    // Spawn process
    child_process.fork('./src/process', [JSON.stringify(processArgs)]);  
  }
}

// Entry-point
module.exports.run = run