// Description:
//
// Replaces placeholder occurrences in every format/case,
// from either a string or a stream.
//

const stream = require('stream')
const Readable = stream.Readable
const replaceStream = require('replacestream')

function streamFromString(string) {
  var s = new Readable
  s._read = function noop() { };
  s.push(string)
  s.push(null) // indicates end of the stream

  return s
}

module.exports = {
  replacePlaceholderOccurrences: function (search, replace) {
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
}