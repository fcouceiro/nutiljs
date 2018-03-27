const replace = require('./replace')
const utils = require('./utils')
const fs = require('fs')
const path = require('path')
const pipeStreams = require('pipe-streams-to-promise')
const Q = require('q')

// Generate desired output from:
// arg - provided service/controller/model name
// placeholderDir - placeholder directory
// placeholderFiles - which placeholders to use
module.exports.start = (arg, placeholderDir, placeholderFiles, outputDir) => {
  // Make output dir
  utils.mkdir(outputDir)

  let copyOperations = []

  // Handle each placeholder
  for (var i = 0, len = placeholderFiles.length; i < len; ++i){
    // Generate output file name
    let placeholderFileName = placeholderFiles[i]
    let fileNameStream = replace.allPlaceholderOccurrences(placeholderFileName, arg)
    
    let copyOperation = utils.sinkStream(fileNameStream)
      .then(outputFileName => {
        // Generate boilerplate from placeholder file
        let copyStream = replace.allPlaceholderOccurrences(fs.createReadStream(path.join(placeholderDir, placeholderFileName)), arg)
        
        // Copy to destination
        let writeStream = fs.createWriteStream(path.join(outputDir, outputFileName))

        return pipeStreams([copyStream, writeStream])
      })
      .catch(error => console.error(error))

      // Push operation
      copyOperations.push(copyOperation)
  }

  // Await all
  return Q.all(copyOperations)
}