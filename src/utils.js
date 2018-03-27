const fs = require('fs')
const sh = require('shelljs');
const sink = require('stream-sink')

// Creates directory, if it does not exist, synchronously
function mkdir(dir) {
  if (!fs.existsSync(dir)){
    sh.mkdir('-p', dir);
  }
}

// Accumulates stream content.
// Sinks stream result as object and catch errors.
//
// Returns a promise.
function sinkStream(stream) {
  return stream.pipe(sink.object({ upstreamError: true }))
    .then(data => Buffer.concat(data).toString('utf8'))
}

// Expose API
module.exports = {
  mkdir: mkdir,
  sinkStream: sinkStream
}