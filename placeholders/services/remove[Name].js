const [Name] = require('../../models/[name]')

module.exports = function(id){
  return [Name].deleteOne({ _id: id })
}