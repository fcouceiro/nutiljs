const [Name] = require('../../models/[name]')
const findById = require('./find[Name]ById')

module.exports = function (id, props) {
  return [Name].update({ _id: id }, props)
    .then(() => findById(id))
}