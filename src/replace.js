const inflection = require('inflection')
const stream = require('stream')
const Readable = stream.Readable
const replaceStream = require('replacestream')
const PLACEHOLDER_KEYS = require('../gen-config.json').placeholderKeys

// Creates stream from string content
function streamFromString(string) {
  var s = new Readable
  s._read = function noop() { };
  s.push(string)
  s.push(null) // indicates end of the stream

  return s
}

// Replaces placeholder occurrences in every format/case,
// from a search string or stream.
//
// Returns the transformed stream.
function replace(search, replace) {
  // Create stream from search if it isnt already
  if (!(search instanceof stream.Readable)) {
    search = streamFromString(search)
  }

  // Generate replace values in every format
  let replaceSingular = inflection.singularize(replace)
  let replacePlural = inflection.pluralize(replace)

  let values = {
    singular: {
      lowerCase: replaceSingular.toLowerCase(),
      upperCase: replaceSingular.toUpperCase(),
      pascalCase: inflection.camelize(replaceSingular)
    },
    plural: {
      lowerCase: replacePlural.toLowerCase(),
      upperCase: replacePlural.toUpperCase(),
      pascalCase: inflection.camelize(replacePlural)
    }
  }

  // Transform input
  return search
    // Singular
    .pipe(replaceStream(PLACEHOLDER_KEYS.singular.lowerCase, values.singular.lowerCase, { ignoreCase: false }))
    .pipe(replaceStream(PLACEHOLDER_KEYS.singular.upperCase, values.singular.upperCase, { ignoreCase: false }))
    .pipe(replaceStream(PLACEHOLDER_KEYS.singular.pascalCase, values.singular.pascalCase, { ignoreCase: false }))
    // Plural
    .pipe(replaceStream(PLACEHOLDER_KEYS.plural.lowerCase, values.plural.lowerCase, { ignoreCase: false }))
    .pipe(replaceStream(PLACEHOLDER_KEYS.plural.upperCase, values.plural.upperCase, { ignoreCase: false }))
    .pipe(replaceStream(PLACEHOLDER_KEYS.plural.pascalCase, values.plural.pascalCase, { ignoreCase: false }))
}

// Expose API
module.exports = {
  allPlaceholderOccurrences: replace
}