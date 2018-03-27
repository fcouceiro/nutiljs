#!/usr/bin/env node
var program = require('commander')
var computer = require('./src/computer')
var replace = require('./src/replace')
var utils = require('./src/utils')

// Create CLI program
program
  .version('0.0.1', '-v, --version')
  .option('-c, --controller <controller>', 'The name of the controller to generate')
  .option('-s, --service <service>', 'The name of the service to generate')
  .parse(process.argv)

// Show usage info if no options were provided
if (!process.argv.slice(2).length) {
  program.help() // This call exits the program immediately
}

// Run it
computer.run(program)