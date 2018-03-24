#!/usr/bin/env node
var program = require('commander')
var generator = require('./generator')

program
  .version('0.0.1', '-v, --version')
  .option('-c, --controller <controller>', 'The name of the controller to generate')
  .option('-s, --service <service>', 'The name of the service to generate')
  .parse(process.argv)

// Show usage info if no options were provided
if (!process.argv.slice(2).length) {
  program.help() // This call exits the program immediately
}

generator.run(program)